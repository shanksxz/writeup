import express, { type Request, type Response, type NextFunction } from "express";
import { ALLOWED_ORIGINS, PORT } from "./config/config";
import { dbconnect } from "./config/db";
import logger from "./config/logger";
import commentRouter from "./routes/comments";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/user";
import ApiError from "./utils/apiError";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
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
app.use("/api", commentRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
