import { Router } from "express";
import AuthHandler from "../handlers/auth";

export default class AuthRouter {
    private authHandler: AuthHandler;
    private authRouter: Router;

    constructor() {
        this.authHandler = new AuthHandler();
        this.authRouter = Router();
    }

    public routesInit() {
        this.authRouter.post("/auth/register", this.authHandler.handleCreate.bind(this.authHandler));
        this.authRouter.post("/auth/login", this.authHandler.handleCreate.bind(this.authHandler));
        return this.authRouter;
    }
}
