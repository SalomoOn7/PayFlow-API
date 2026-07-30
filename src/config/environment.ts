import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
    accessTokenExpiry: "15m" as const,
    refreshTokenExpiry: "7d" as const,
    midtransClientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    midtransServerKey: process.env.MIDTRANS_SERVER_KEY || '',
    midtransIsProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
};

export default config;