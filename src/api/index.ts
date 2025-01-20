import express, { Express } from "express";
import Logger from "../utils/logger";
import cors from "cors";
import config from "../configs/config";
import exportEndpoints from "../utils/postman";
import AuthRouter from "../routes/auth";
import ProductRouter from "../routes/products";
import PurchasesRouter from "../routes/purchases";
import SkinportRouter from "../routes/skinport";

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

    private middlewares() {
        this.apiServer.use(express.json());
        this.apiServer.use(express.urlencoded({ extended: true })); 
    }

    private routesCors() {
        return this.apiServer.use(cors({
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
    }

    private routesV2() {
        const router = express.Router(); 
        const productsRouter = new ProductRouter().routesInit();
        const purchasesRouter = new PurchasesRouter().routesInit();
        const skinportRouter = new SkinportRouter().routesInit();

        router.use(productsRouter); 
        router.use(purchasesRouter);
        router.use(skinportRouter);

        return router;
    }

    private routesV1() {
        const router = express.Router();
        const authRouter = new AuthRouter().routesInit();

        router.use(authRouter); 
        
        return router;
    }

    public async start() {
        Logger("INFO", "API", "Init API Endpoints");
        
        this.middlewares();
        this.routesCors();

        this.apiServer.use("/api/v1", this.routesV1());
        this.apiServer.use("/api/v2", this.routesV2()); 

        exportEndpoints(this.apiServer, "../../postman.json")

        this.apiServer.listen(config.httpServerPort, () => {
            Logger("INFO", "API", `Run API Server on port ${config.httpServerPort}`);
        });
    }
}