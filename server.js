import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import createError from "http-errors";
import {
  adminArticlesRouter,
  adminAuthRouter,
  adminCategoriesRouter,
  adminChaptersRouter,
  adminChartsRouter,
  adminCoursesRouter,
  adminSettingsRouter,
  adminUsersRouter,
  articlesRouter,
  authRouter,
  captchaRouter,
  categoriesRouter,
  chaptersRouter,
  coursesRouter,
  likesRouter,
  sampleRouter,
  searchRouter,
  settingsRouter,
  usersRouter,
} from "./routes/index.js";
import { config } from "dotenv";
import { adminAuth, userAuth } from "./middlewares/index.js";
import cors from "cors";
import { mailConsumer } from "./utils/rabbit-mq.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: ["https://clwy.cn", "http://localhost:63342"],
};
app.use(cors(corsOptions));

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/admin/articles", adminAuth, adminArticlesRouter);
app.use("/admin/categories", adminAuth, adminCategoriesRouter);
app.use("/admin/settings", adminAuth, adminSettingsRouter);
app.use("/admin/courses", adminAuth, adminCoursesRouter);
app.use("/admin/users", adminAuth, adminUsersRouter);
app.use("/admin/chapters", adminAuth, adminChaptersRouter);
app.use("/admin/charts", adminAuth, adminChartsRouter);
app.use("/admin/auth", adminAuthRouter);
// Routes
app.use("/", sampleRouter);
app.use("/categories", categoriesRouter);
app.use("/courses", coursesRouter);
app.use("/chapters", chaptersRouter);
app.use("/articles", articlesRouter);
app.use("/settings", settingsRouter);
app.use("/search", searchRouter);
app.use("/auth", authRouter);
app.use("/captcha", captchaRouter);
app.use("/users", userAuth, usersRouter);
app.use("/likes", userAuth, likesRouter);
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

(async () => {
  await mailConsumer();
  console.log("邮件消费者已启动");
})();
