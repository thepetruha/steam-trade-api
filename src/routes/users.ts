import { Router } from "express";
import UsersHandler from "../handlers/users";
import authenticate from "../middleware/auth";

export default class UsersRouter {
    private usersHandler: UsersHandler;
    private usersRouter: Router;

    constructor() {
        this.usersHandler = new UsersHandler();
        this.usersRouter = Router();
    }

    public routesInit() {
        this.usersRouter.post("/user", this.usersHandler.handleCreate.bind(this.usersHandler));
        this.usersRouter.get("/user", authenticate, this.usersHandler.handleFindByAuth.bind(this.usersHandler));
        this.usersRouter.get("/user/:username", this.usersHandler.handleFindByUsername.bind(this.usersHandler)); 
        this.usersRouter.get("/user/search/:value", authenticate, this.usersHandler.handleFindUsers.bind(this.usersHandler));
        this.usersRouter.post("/user/contacts/add", authenticate, this.usersHandler.handleAddContact.bind(this.usersHandler));
        return this.usersRouter;
    }
}