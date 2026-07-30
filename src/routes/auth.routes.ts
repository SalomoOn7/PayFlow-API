import { Router } from "express";
import { registerUser, createSession, refreshSession } from "../controllers/auth.controller";
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export const AuthRouter: Router = Router();

AuthRouter.post('/register', validate(registerSchema), registerUser);
AuthRouter.post('/login', validate(loginSchema), createSession);
AuthRouter.post('/refresh', refreshSession);