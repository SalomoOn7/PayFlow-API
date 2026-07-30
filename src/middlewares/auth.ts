import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import config from "../config/environment";
import { logger } from "../config/logger";

export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string }
        req.userId = decoded.id;
        next();
    } catch (error) {
        logger.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
};