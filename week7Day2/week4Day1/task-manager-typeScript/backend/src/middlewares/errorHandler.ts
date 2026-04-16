import { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  const errorResponse = {
    success: false,
    data: null,
    message: err.message || "An error occurred",
  };

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;