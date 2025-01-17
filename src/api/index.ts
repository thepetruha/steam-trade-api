import express, { Express } from "express";
import Logger from "../utils/logger";
// import cors from "cors";

const API_SERVER_PORT = 4343;

export default class API {
    private static instance: API;
    private apiServer!: Express;

    constructor() {
        this.apiServer = express(); 
    }

    public static init() {
        if (!this.instance) {
            this.instance = new API();
        }

        return this.instance;
    }

    public static getInstance() {
        if (!this.instance) {
            throw new Error('Call init() before getInstance()');
        }

        return this.instance;
    }

    public async start() {
        Logger("INFO", "API", "Init API Endpoints");
        // this.apiServer.use(express.json());
        // this.apiServer.use(express.urlencoded({ extended: true }));
        // this.apiServer.use(cors({
        //     origin: "*",
        //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
        //     allowedHeaders: ['Content-Type', 'Authorization'],
        // }))

        // const authRouter = new AuthRouter().routesInit();
        // this.apiServer.use(authRouter);

        // const usersRouter = new UsersRouter().routesInit();
        // this.apiServer.use(usersRouter);
        
        // const chatsRouter = new ChatsRouter().routesInit();
        // this.apiServer.use(chatsRouter);

        // const messagesRouter = new MessagesRouter().routesInit();
        // this.apiServer.use(messagesRouter);

        this.apiServer.listen(API_SERVER_PORT, () => {
            Logger("INFO", "API", `Run API Server on port ${API_SERVER_PORT}`);
        });
    }
}