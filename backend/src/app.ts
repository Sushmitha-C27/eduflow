import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config/env";
import { securityMiddleware } from "./config/security";
import { healthRouter } from "./modules/health";
import { authRouter } from "./modules/auth";
import { subjectsRouter } from "./modules/subjects";
import { videosRouter } from "./modules/videos";
import { progressRouter } from "./modules/progress";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(securityMiddleware);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/videos", videosRouter);
app.use("/api/progress", progressRouter);

app.use(errorHandler);

