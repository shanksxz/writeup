import mongoose from "mongoose";
import { DATABASE_URL } from "./config";

export const dbconnect = async () => {
  try {
    //TODO: idk why but DATABASE_URL is the real db url not the in-memory one
    console.log("Connecting to database:", process.env.DATABASE_URL);
    await mongoose.connect(process.env.DATABASE_URL!);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};
