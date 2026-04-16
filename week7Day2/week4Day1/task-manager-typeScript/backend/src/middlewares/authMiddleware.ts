import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined;
  let authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({ message: "No token, autherization denied" });
    return;
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decode;
    console.log("The decoded user is : ", (req as any).user);
    next();
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

export default verifyToken;