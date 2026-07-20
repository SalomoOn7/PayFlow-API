import { Response, Request, Router } from "express";

export const HealthRouter: Router = Router();

HealthRouter.get("/health", (req: Request, res: Response) => {
    console.log("Health Check Success")
    res.status(200).send({ status: "200" })
})