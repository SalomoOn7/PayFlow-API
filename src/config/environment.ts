import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
};

export default config;