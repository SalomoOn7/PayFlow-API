import { Application, Router } from "express";
import { HealthRouter } from "../routes/health";
import { AuthRouter } from "../routes/auth.routes";
import { TransactionRoute } from "./transaction.route";

const _routes: Array<[string, Router]> = [
    ["/health", HealthRouter],
    ["/auth", AuthRouter],
    ["/transactions", TransactionRoute],
];

export const routes = (app: Application) => {
    _routes.forEach((route) => {
        const [url, router] = route;
        app.use(url, router);
    });
};