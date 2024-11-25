import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "../config/config";
import { User } from "../models";
import type { JwtPayload } from "../types";
import ApiError from "../utils/apiError";
import { userSchema } from "../validators";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  error?: any;
}

export const signup = async (req: Request, res: Response<AuthResponse>) => {
  try {
    const { firstName, lastName, username, email, password } = userSchema.parse(req.body);

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      throw new ApiError(
        400, 
        `User already exists with this ${existingUser.email === email ? 'email' : 'username'}`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    generateToken(res, user._id.toString());

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(201).json({ 
      success: true,
      message: "User created successfully",
      user: userResponse 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false,
        error: error.errors 
      });
    } else if (error instanceof ApiError) {
      res.status(error.statusCode).json({ 
        success: false,
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = signInSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    generateToken(res, user._id.toString());

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(200).json({ 
      success: true,
      user: userResponse 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const signout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Signout successful" });
};
