import { Request, Response, NextFunction } from "express";
import { handleMidtransNotification } from "../services/webhook.service";
import { midtransNotificationSchema } from "../schemas/webhook.schema";

export const midtransNotificationHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = midtransNotificationSchema.parse(req.body);
        await handleMidtransNotification(parsed);
        res.status(200).json({ message: "Notification processed" });
    } catch (error) {
        next(error);
    }
};