import express, { type Request, type Response, type NextFunction } from "express";
import { ALLOWED_ORIGINS } from "./config/config";
import logger from "./config/logger";
import commentRouter from "./routes/comments";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/user";
import ApiError from "./utils/apiError";
import cookieParser from "cookie-parser";
import cors from "cors";

// Create Express app instance
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

app.use("/api", userRoutes);  // Changed from /api/users to /api/auth
app.use("/api", postRoutes);
app.use("/api", commentRouter);

// Error handling middleware
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

export { app };


