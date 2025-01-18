"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("../utils/logger"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../configs/config"));
class API {
    constructor() {
        this.apiServer = (0, express_1.default)();
    }
    static init() {
        if (!this.instance) {
            this.instance = new API();
        }
        return this.instance;
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('Call init() before getInstance()');
        }
        return this.instance;
    }
    routesV2() {
        const router = express_1.default.Router();
        router.use(express_1.default.json());
        router.use(express_1.default.urlencoded({ extended: true }));
        router.use((0, cors_1.default)({
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        router.get("/hello", (req, res) => {
            res.send({
                s: "hello"
            });
        });
        // const authRouter = new AuthRouter().routesInit();
        // this.apiServer.use(authRouter);
        return router;
    }
    routesV1() {
        const router = express_1.default.Router();
        // const usersRouter = new UsersRouter().routesInit();
        // const messagesRouter = new MessagesRouter().routesInit();
        // const chatsRouter = new ChatsRouter().routesInit();
        // router.use(usersRouter); 
        // router.use(chatsRouter);
        // router.use(messagesRouter); 
        return router;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, logger_1.default)("INFO", "API", "Init API Endpoints");
            this.apiServer.use("/api/v1", this.routesV1());
            this.apiServer.use("/api/v2", this.routesV2());
            console.log(config_1.default);
            this.apiServer.listen(config_1.default.httpServerPort, () => {
                (0, logger_1.default)("INFO", "API", `Run API Server on port ${config_1.default.httpServerPort}`);
            });
        });
    }
}
exports.default = API;
