import { Router } from "express";
import { createTransactionHandler, getTransactionStatusHandler } from "../controllers/transaction.controller";
import { validate } from "../middlewares/validate";
import { createTransactionSchema } from "../schemas/transaction.schema";
import { authenticate } from "../middlewares/auth";
import { idempotencyCheck } from "../middlewares/idempotency";

export const TransactionRoute: Router = Router();

TransactionRoute.post('/', authenticate, idempotencyCheck, validate(createTransactionSchema), createTransactionHandler);

TransactionRoute.get('/:orderId', authenticate, getTransactionStatusHandler);