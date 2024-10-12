import express, { Request, Response, NextFunction } from "express";
import logger from "@/config/logger";
import { PORT } from "@/config/config";
import userRoutes from "@/routes/user";
import postRoutes from "@/routes/posts";
import ApiError from "@/utils/apiError";
import { dbconnect } from "@/config/db";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://writeup-xi.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

dbconnect();

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
