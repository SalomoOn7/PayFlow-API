import { Router } from "express";
import { midtransNotificationHandler } from "../controllers/webhook.controller";

export const WebHookRoute: Router = Router();

WebHookRoute.post("/midtrans", midtransNotificationHandler);