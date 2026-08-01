import mongoose, { Document, Schema } from "mongoose";

export interface IIdempontencyKey extends Document {
    key: string;
    userId: string;
    response: Record<string, unknown>;
    statusCode: number;
    createAt: Date;
}

const idempotencyKeySchema = new Schema<IIdempontencyKey>(
    {
        key: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        response: { type: Schema.Types.Mixed, required: true },
        statusCode: { type: Number, required: true }
    },
    { timestamps: true }
);

idempotencyKeySchema.index({ createAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model<IIdempontencyKey>("IdempotencyKey", idempotencyKeySchema);