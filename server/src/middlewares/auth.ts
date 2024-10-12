import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import ApiError from "../utils/apiError";
import { JwtPayload } from "../types";

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Unauthorized - Invalid token");
      } else if (jwtError instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Unauthorized - Token expired");
      } else {
        throw new ApiError(500, "Internal server error during authentication");
      }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

