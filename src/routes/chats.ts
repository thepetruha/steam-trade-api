import { Router } from "express";
import ChatsHandler from "../handlers/chats";
import authenticate from "../middleware/auth";

export default class ChatsRouter {
    private chatsHandler: ChatsHandler;
    private chatsRouter: Router;

    constructor() {
        this.chatsHandler = new ChatsHandler();
        this.chatsRouter = Router();
    }

    public routesInit() {
        this.chatsRouter.use(authenticate);
        this.chatsRouter.post("/chats/create", this.chatsHandler.handleCreate.bind(this.chatsHandler));
        this.chatsRouter.get("/chats/:chatId", this.chatsHandler.handleGetChatById.bind(this.chatsHandler));
        this.chatsRouter.get("/chats", this.chatsHandler.handleGetMyChats.bind(this.chatsHandler));
        return this.chatsRouter;
    }
}
