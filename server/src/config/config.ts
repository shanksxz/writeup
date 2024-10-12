import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const configSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

const envVars = configSchema.parse(process.env);

export const PORT = envVars.PORT;
export const DATABASE_URL = envVars.DATABASE_URL;
export const JWT_SECRET = envVars.JWT_SECRET;
export const CLOUDINARY_CLOUD_NAME = envVars.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = envVars.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = envVars.CLOUDINARY_API_SECRET;

