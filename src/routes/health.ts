import { Response, Request, Router } from "express";
import { logger } from "../config/logger";

export const HealthRouter: Router = Router();

// kenapa slash nya dikosongin. karena kalau diisi /health nanti jadinya  http://localhost:4000/health/health
HealthRouter.get("/", (req: Request, res: Response) => {
  logger.info("Health check success");
  res.status(200).send({ status: "200" });
});