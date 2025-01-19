import { Router } from "express";
import PurchasesHandler from "../handlers/purchases";

export default class PurchasesRouter {
    private purchasesHandler: PurchasesHandler;
    private purchasesrouter: Router;

    constructor() {
        this.purchasesHandler = new PurchasesHandler();
        this.purchasesrouter = Router();
    }

    public routesInit() {
        this.purchasesrouter.post("/purchase", this.purchasesHandler.handleCreate.bind(this.purchasesHandler));
        return this.purchasesrouter;
    }
}
