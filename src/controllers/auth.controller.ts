import { Request, Response, NextFunction } from "express";
import {
    registerUser as registerUserService,
    createSession as createSessionService,
    refreshSession as refreshSessionService,
} from '../services/auth.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await registerUserService(req.body)
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await createSessionService(req.body)
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const refreshSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshSessionService(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}