import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/userModel";
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
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
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
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error(`${email} not found`);
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid Credentials");
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
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