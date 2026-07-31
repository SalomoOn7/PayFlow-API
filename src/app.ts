import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { routes } from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// security headers
app.use(helmet());

// parse body request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: false, statusCode: 429, message: "Too many requests, please try again later" },
});
app.use(globalLimiter);

routes(app);

app.use(errorHandler);

export default app;