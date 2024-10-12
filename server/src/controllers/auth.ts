import { z } from "zod";
import { User } from "../models";
import { userSchema } from "../validators";
import { JWT_SECRET } from "../config/config";
import ApiError from "../utils/apiError";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { JwtPayload } from "../types";


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

export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, password } = userSchema.parse(
      req.body
    );

    // check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create the user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    // create the token
    // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    // convert object id to string

    generateToken(res, user._id.toString());

    res.status(201).json({ user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
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

    // compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    // create the token
    generateToken(res, user._id.toString());

    // send the user as response
    res.status(200).json({ user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
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
