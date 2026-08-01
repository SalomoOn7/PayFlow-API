import { NextFunction, Response, } from "express";
import { AuthRequest } from "../middlewares/auth"
import { createTransaction, getTransactionStatus } from "../services/transaction.service";
import IdempotencyKey from "../models/IdempotencyKey";

export const createTransactionHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId as string;
        const result = await createTransaction(userId, req.body);

        if (req.idempotencyKey) {
            await IdempotencyKey.create({
                key: req.idempotencyKey,
                userId,
                response: result,
                statusCode: 201,
            });
        }

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export const getTransactionStatusHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const result = await getTransactionStatus(orderId as string);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}