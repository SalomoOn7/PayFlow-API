import { randomUUID } from "node:crypto";
import { coreApi } from "../config/midtrans";
import Transaction from "../models/Transaction";
import { CreateTransactionInput } from "../schemas/transaction.schema";
import { logger } from "../config/logger";

export const createTransaction = async (userId: string, input: CreateTransactionInput) => {
    const orderId = `PAYFLOW-${randomUUID()}`;

    const chargeParameter: Parameters<typeof coreApi.charge>[0] = {
        payment_type: input.paymentMethod,
        transaction_details: {
            order_id: orderId,
            gross_amount: input.amount,
        },
    };

    if (input.paymentMethod === "bank_transfer") {
        if (!input.bank) {
            throw new Error("Bank is required for bank_transfer payment method");
        }
        chargeParameter.bank_transfer = { bank: input.bank };
    }

    const midtransResponse = await coreApi.charge(chargeParameter);

    logger.info({ orderId, midtransResponse }, "Midtrans charge response");

    const transaction = await Transaction.create({
        orderId,
        user: userId,
        amount: input.amount,
        currency: "IDR",
        status: "pending",
        paymentMethod: input.paymentMethod,
        midtransTransactionId: midtransResponse.transaction_id,
    });

    return {
        transaction,
        paymentDetails: midtransResponse,
    };
};

export const getTransactionStatus = async (orderId: string) => {
    const transaction = await Transaction.findOne({ orderId });
    if (!transaction) {
        throw new Error("Transaction not found");
    }

    const midtransStatus = await coreApi.transaction.status(orderId);

    return { transaction, midtransStatus };
};