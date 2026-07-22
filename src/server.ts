import app from "./app";
import connectDB from "./config/connectDB";
import { logger } from "./config/logger";
import config from "./config/environment";

const startServer = async () => {
    await connectDB();


    app.listen(config.port, () => {
        logger.info(`PayFlow API running on port ${config.port}`)
    });
};

startServer();