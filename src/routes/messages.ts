import { Router } from "express";
import MessagesHandler from "../handlers/messages";
import authenticate from "../middleware/auth";

export default class MessagesRouter {
    private messagesHandler: MessagesHandler;
    private messagesRouter: Router;

    constructor() {
        this.messagesHandler = new MessagesHandler();
        this.messagesRouter = Router();
    }

    public routesInit() {
        this.messagesRouter.post("/messages/create", authenticate, this.messagesHandler.handleCreate.bind(this.messagesHandler));
        this.messagesRouter.get("/messages/:roomId", authenticate, this.messagesHandler.handleGetByRoomId.bind(this.messagesHandler));
        return this.messagesRouter;
    }
}
