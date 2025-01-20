import { Router } from "express";
import SkinportHandler from "../handlers/skinport";

export default class SkinportRouter {
    private skinportHandler: SkinportHandler;
    private skinportRouter: Router;

    constructor() {
        this.skinportHandler = new SkinportHandler();
        this.skinportRouter = Router();
    }

    public routesInit() {
        this.skinportRouter.post("/skinport/items", this.skinportHandler.getItems.bind(this.skinportHandler));
        return this.skinportRouter;
    }
}
