import { Router } from "express";
import ProductsHandler from "../handlers/products";
import authenticate from "../middleware/auth";

export default class ProductRouter {
    private productHandler: ProductsHandler;
    private productRouter: Router;

    constructor() {
        this.productHandler = new ProductsHandler();
        this.productRouter = Router();
    }

    public routesInit() {
        this.productRouter.post("/product/purchase", authenticate, this.productHandler.handlePurchase.bind(this.productHandler));
        return this.productRouter;
    }
}