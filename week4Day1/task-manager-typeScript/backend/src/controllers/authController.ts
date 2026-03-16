import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { findUserByEmail, createUser } from "../utils/fileStorage";
import { constants } from "../middlewares/constants";
import { Request, Response, NextFunction } from "express";

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Email and password are required");
    }
    
    if (!validator.isEmail(email)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid email format");
    }
    
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Email already exists");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = createUser(email, hashedPassword);
    res.status(201).json({ 
      success: true, 
      data: { email: newUser.email },
      message: `User registered with email ${email}` 
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Email and password are required");
    }
    
    if (!validator.isEmail(email)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid email format");
    }
    
    const user = findUserByEmail(email);
    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error(`${email} not found`);
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid Credentials");
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.status(200).json({ 
      success: true, 
      data: { token }, 
      message: "Login successful" 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };

export { register, login };