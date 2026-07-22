import mongoose, { Document, Schema, Types } from "mongoose";

export type TransactionStatus =
    | "pending"
    | "success"
    | "failed"
    | "expired";

export interface ITransaction extends Document {
    orderId: string;
    user: Types.ObjectId;
    amount: number;
    currency: string;
    status: TransactionStatus;
    paymentMethod?: string;
    midtransTransactionId?: string;
    createAt: Date;
    updateAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        currency: {
            type: String,
            default: 'IDR',
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed", "expired"],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
        },
        midtransTransactionId: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);