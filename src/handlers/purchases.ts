import { Request, Response } from "express";
import Handler, { Status } from ".";
import PurchaseStore, { IPurchase } from "../store/purchases";

export default class PurchasesHandler extends Handler {
    private purchaseStore: PurchaseStore;

    constructor() {
        super();
        this.purchaseStore = new PurchaseStore();
    }

    public async handleCreate(req: Request, res: Response) {
        try {
            const purchaseBody = req.body as IPurchase;

            const purchase: IPurchase = {
                user_id: purchaseBody.user_id,
                product_id: purchaseBody.product_id
            }

            const userCreated = await this.purchaseStore.create(purchase);
            this.response(res, Status.Ok, { isCreated: userCreated !== null });
        } catch (error) {
            console.error("Error in handleCreate:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
