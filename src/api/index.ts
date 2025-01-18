import express, { Express } from "express";
import Logger from "../utils/logger";
import cors from "cors";
import config from "../configs/config";

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

    private routesV2() {
        const router = express.Router();

        router.use(express.json());
        router.use(express.urlencoded({ extended: true }));
        router.use(cors({
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));

        router.get("/hello", (req, res) => {
            res.send({
                s: "hello"
            })
        })
 
        // const authRouter = new AuthRouter().routesInit();
        // this.apiServer.use(authRouter);
        
        return router;
    }

    private routesV1() {
        const router = express.Router();
        // const usersRouter = new UsersRouter().routesInit();
        // const messagesRouter = new MessagesRouter().routesInit();
        // const chatsRouter = new ChatsRouter().routesInit();
 
        // router.use(usersRouter); 
        // router.use(chatsRouter);
        // router.use(messagesRouter); 

        return router;
    }

    public async start() {
        Logger("INFO", "API", "Init API Endpoints");

        this.apiServer.use("/api/v1", this.routesV1());
        this.apiServer.use("/api/v2", this.routesV2()); 

        console.log(config)

        this.apiServer.listen(config.httpServerPort, () => {
            Logger("INFO", "API", `Run API Server on port ${config.httpServerPort}`);
        });
    }
}