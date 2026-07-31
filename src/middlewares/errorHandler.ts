import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../config/logger";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.error({ statusCode: err.statusCode, message: err.message });
        return res.status(err.statusCode).json({ message: err.message });
    }

    // error tak terduga — jangan expose detail ke client
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
};