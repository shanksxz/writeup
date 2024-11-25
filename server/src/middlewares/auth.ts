import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import type { JwtPayload } from "../types";
import ApiError from "../utils/apiError";

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;
    console.log("token", token);
    if (!token) {
      console.log("No token provided");
      throw new ApiError(401, "Unauthorized - No token provided");
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log("decoded", decoded);
      req.user = decoded;
      next();
    } catch (jwtError) {
      console.log("jwtError", jwtError);
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
