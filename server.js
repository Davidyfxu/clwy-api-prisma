import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import createError from "http-errors";
import { adminArticlesRouter } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/admin/articles", adminArticlesRouter);
// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CLWY Prisma API" });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// 捕获 SIGTERM 信号
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
