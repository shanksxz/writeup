import mongoose from "mongoose";
import { DATABASE_URL } from "./config";

export const dbconnect = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed");
  }
};
