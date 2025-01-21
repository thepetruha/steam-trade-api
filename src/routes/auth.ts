import { Router } from "express";
import AuthHandler from "../handlers/auth";
import authenticate from "../middleware/auth";

export default class AuthRouter {
    private authHandler: AuthHandler;
    private authRouter: Router;

    constructor() {
        this.authHandler = new AuthHandler();
        this.authRouter = Router();
    }

    public routesInit() {
        this.authRouter.post("/auth/register", this.authHandler.handleRegist.bind(this.authHandler));
        this.authRouter.post("/auth/password/change", authenticate, this.authHandler.handleChangePassword.bind(this.authHandler));
        return this.authRouter;
    }
}
