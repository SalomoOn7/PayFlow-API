import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createAt: Date;
    updateAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);