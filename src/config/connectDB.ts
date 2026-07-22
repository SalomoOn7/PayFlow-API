import mongoose from "mongoose";
import config from "./environment";
import { logger } from "./logger";

const connectDB = async (): Promise<void> => {
    try {
        if (!config.db) {
            throw Error('MONGO_URI is not defined in environment variables')
        }

        await mongoose.connect(config.db);
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error('Could not connect to DB');
        logger.error(error);
        process.exit(1);
    }
};

export default connectDB;