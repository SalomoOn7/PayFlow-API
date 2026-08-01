import { Response, NextFunction } from "express";
import IdempotencyKey from "../models/IdempotencyKey";
import { AuthRequest } from "./auth";
import { AppError } from "../utils/AppError";

export const idempotencyCheck = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const idempotencyKeyHeader = req.headers["idempotency-key"];

    if (!idempotencyKeyHeader || typeof idempotencyKeyHeader !== "string") {
        return next(new AppError("Idempotency-Key header is required", 400));
    }

    const existing = await IdempotencyKey.findOne({ key: idempotencyKeyHeader });

    if (existing) {
        return res.status(existing.statusCode).json(existing.response);
    }

    req.idempotencyKey = idempotencyKeyHeader;
    next();
}