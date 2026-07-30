import { Response, } from "express";
import { AuthRequest } from "../middlewares/auth"
import { createTransaction, getTransactionStatus } from "../services/transaction.service";
import { logger } from "../config/logger";

export const createTransactionHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId as string;
        const result = await createTransaction(userId, req.body);
        res.status(201).json(result);
    } catch (error) {
        logger.error(error);
        res.status(400).json({ message: (error as Error).message });
    }
}

export const getTransactionStatusHandler = async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;
        const result = await getTransactionStatus(orderId as string);
        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        res.status(404).json({ message: (error as Error).message });
    }
}