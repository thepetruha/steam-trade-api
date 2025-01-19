import { Request, Response } from "express";
import UserStore, { IUser, IUserRegister } from "../store/users";
import Handler, { Status } from ".";
import {hashPassword} from "../utils/hasher";
import ProductStore, { IProduct } from "../store/products";

export default class ProductsHandler extends Handler {
    private productStore: ProductStore;

    constructor() {
        super();
        this.productStore = new ProductStore();
    }

    public async handleCreate(req: Request, res: Response) {
        try {
            const productBody = req.body as IProduct;

            const product: IProduct = {
                name: "",
                price: 0
            }

            const userCreated = await this.productStore.create(product);
            this.response(res, Status.Ok, { isCreated: userCreated !== null });
        } catch (error) {
            console.error("Error in handleCreate:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
