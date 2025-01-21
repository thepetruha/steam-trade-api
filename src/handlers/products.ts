import { Request, Response } from "express";
import Handler, { Status } from ".";
import ProductStore from "../store/products";
import PurchaseStore from "../store/purchases";
import UserStore, { IUserStoreResponse } from "../store/users";

export default class ProductsHandler extends Handler {
    private productStore: ProductStore;
    private purchaseStore: PurchaseStore;
    private userStore: UserStore;

    constructor() {
        super();
        this.productStore = new ProductStore();
        this.purchaseStore = new PurchaseStore();
        this.userStore = new UserStore();
    }

    public async handlePurchase(req: Request, res: Response) {
        try {
            const { user, product_id, quantity } = req.body as {
                user: IUserStoreResponse;
                product_id: number;
                quantity: number;
            };

            const product = await this.productStore.findById(product_id);
            if (!product) {
                this.response(res, Status.NotFound, null, "Product not found");
                return;
            }

            if (product.quantity < quantity) {
                this.response(res, Status.BadRequest, null, "Insufficient stock");
                return;
            }

            const updatedStock = product.quantity - quantity;
            await this.productStore.updateStock(product_id, updatedStock);

            const totalPrice = product.price * quantity;

            if (Number(user.balance_eur) < Number(totalPrice)) {
                this.response(res, Status.BadRequest, null, "There are not enough funds on your balance");
                return;
            }

            const newUserBalance = user.balance_eur - totalPrice;
            const updatedUser = this.userStore.updateBalanceById(user.id, newUserBalance);
            if (!updatedUser) throw new Error("Failed update balance");

            const purchase = await this.purchaseStore.create({
                quantity,
                product_id,
                user_id: user.id,
                total_price: totalPrice,
            });

            this.response(res, Status.Ok, { 
                purchase, 
                newUserBalance: newUserBalance.toFixed(2),
                oldUserBalance: user.balance_eur
             });
        } catch (error) {
            console.error("Error in handlePurchase:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}