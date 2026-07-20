import express, { Application, Request, Response } from "express";
import cors from 'cors';
import helmet from "helmet";
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        message: 'PayFlow API is running',
        timestamp: new Date().toISOString(),
    });
});

export default app;