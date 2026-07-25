import { Request, Response } from "express";
import {
    registerUser as registerUserService,
    createSession as createSessionService,
    refreshSession as refreshSessionService,
} from '../services/auth.service';
import { logger } from '../config/logger';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const result = await registerUserService(req.body)
        res.status(201).json(result);
    } catch (error) {
        logger.error(error);
        res.status(400).json({ message: (error as Error).message });
    }
};

export const createSession = async (req: Request, res: Response) => {
    try {
        const result = await createSessionService(req.body)
        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        res.status(400).json({ message: (error as Error).message });
    }
};

export const refreshSession = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshSessionService(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        res.status(401).json({ message: (error as Error).message });
    }
}