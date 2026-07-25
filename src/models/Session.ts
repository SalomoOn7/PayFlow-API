import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISession extends Document {
    user: Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
    createAt: Date;
};

const sessionSchema = new Schema<ISession>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// untuk auto delete expired session

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISession>("Session", sessionSchema);