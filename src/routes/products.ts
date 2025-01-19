import { Router } from "express";
import ProductsHandler from "../handlers/products";

export default class ProductRouter {
    private productHandler: ProductsHandler;
    private productRouter: Router;

    constructor() {
        this.productHandler = new ProductsHandler();
        this.productRouter = Router();
    }

    public routesInit() {
        this.productRouter.post("/product", this.productHandler.handleCreate.bind(this.productHandler));
        return this.productRouter;
    }
}
