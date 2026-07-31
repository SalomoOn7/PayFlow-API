import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import config from '../config/environment';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import Session from '../models/Session';
import { AppError } from '../utils/AppError';

const generateaAccessToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwtSecret, {
        expiresIn: config.accessTokenExpiry,
    });
};

const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwtRefreshSecret, {
        expiresIn: config.refreshTokenExpiry,
    });
};

const createSesionRecord = async (userId: string, refreshToken: string) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await Session.create({ user: userId, refreshToken, expiresAt });
};

export const registerUser = async (input: RegisterInput) => {
    const existingUser = await User.findOne({ email: input.email });

    if (existingUser) {
        throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user: IUser = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
    });

    const accesToken = generateaAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await createSesionRecord(user._id.toString(), refreshToken);

    return {
        user: { id: user._id, name: user.name, email: user.email },
        accesToken,
        refreshToken,
    };
};

export const createSession = async (input: LoginInput) => {
    const user = await User.findOne({ email: input.email })
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    const accesToken = generateaAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await createSesionRecord(user._id.toString(), refreshToken);

    return {
        user: { id: user._id, name: user.name, email: user.email },
        accesToken,
        refreshToken,
    };
};

export const refreshSession = async (token: string) => {
    if (!token) {
        throw new AppError('Refresh token is required', 401);
    }

    const existingSession = await Session.findOne({ refreshToken: token });
    if (!existingSession) {
        throw new AppError('Invalid refresh token', 401);
    }

    let decode: { id: string };
    try {
        decode = jwt.verify(token, config.jwtRefreshSecret) as { id: string };
    } catch {
        await Session.deleteOne({ refreshToken: token });
        throw new AppError('Refresh token expired or invalid', 401);
    }

    //rotate: hapus refresh token lama, buat yang baru
    await Session.deleteOne({ refreshToken: token });

    const accesToken = generateaAccessToken(decode.id);
    const newRefreshToken = generateRefreshToken(decode.id);
    await createSesionRecord(decode.id, newRefreshToken);

    return { accesToken, refreshToken: newRefreshToken };
};