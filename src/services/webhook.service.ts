import crypto from "node:crypto";
import Transaction from "../models/Transaction";
import { AppError } from "../utils/AppError";
import config from "../config/environment";
import { logger } from "../config/logger";
import { MidtransNotification } from "../schemas/webhook.schema";

const verifySignature = (payload: MidtransNotification): boolean => {
    const { order_id, status_code, gross_amount, signature_key } = payload;

    const expectedSignature = crypto
        .createHash("sha512")
        .update(order_id + status_code + gross_amount + config.midtransServerKey)
        .digest("hex");

    return expectedSignature === signature_key;
};

const mapMidtransStatusToInternal = (
    transactionStatus: string,
    fraudStatus?: string
): "pending" | "success" | "failed" | "expired" => {
    if (transactionStatus === "capture") {
        return fraudStatus === "accept" ? "success" : "failed";
    }
    if (transactionStatus === "settlement") return "success";
    if (transactionStatus === "deny") return "failed";
    if (transactionStatus === "cancel") return "failed";
    if (transactionStatus === "expire") return "expired";
    return "pending";
};

export const handleMidtransNotification = async (
    payload: MidtransNotification
) => {
    const isValid = verifySignature(payload);

    if (!isValid) {
        logger.error({ orderId: payload.order_id }, "Invalid Midtrans signature");
        throw new AppError("Invalid signature", 403);
    }

    const transaction = await Transaction.findOne({ orderId: payload.order_id });
    if (!transaction) {
        throw new AppError("Transaction not found", 404);
    }

    const newStatus = mapMidtransStatusToInternal(
        payload.transaction_status,
        payload.fraud_status
    );

    if (transaction.status === newStatus) {
        logger.info(
            { orderId: payload.order_id, status: newStatus },
            "Duplicate webhook notification, status unchanged, skipping"
        );
        return transaction;
    }

    transaction.status = newStatus;
    await transaction.save();

    logger.info(
        { orderId: payload.order_id, newStatus },
        "Transaction status updated via webhook"
    );
    return transaction;
};

