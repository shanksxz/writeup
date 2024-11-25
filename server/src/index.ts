import { app } from "./app";
import { PORT } from "./config/config";
import { dbconnect } from "./config/db";
import logger from "./config/logger";

// Connect to database only when starting the server (not during tests)
if (process.env.NODE_ENV !== 'test') {
  dbconnect()
    .then(() => {
      logger.info("Database connected successfully");
    })
    .catch((error) => {
      logger.error("Database connection failed", error);
      process.exit(1);
    });
}

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

export { server };
