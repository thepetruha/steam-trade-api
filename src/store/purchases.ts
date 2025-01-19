import postgres from "postgres";
import Store from ".";
import Logger from "../utils/logger";

export interface IPurchaseStoreResponse extends IPurchaseStore {
    id: number;
}

export interface IPurchaseStore extends IPurchase {
    purchase_date: Date;
}

export interface IPurchase {
    user_id: number;
    product_id: number;
}


export default class PurchaseStore {
    private db: postgres.Sql;

    constructor() {
        this.db = Store.getInstance().getDatabase();
    }

    public async create(purchase: IPurchase) {
        try {
            const storePurchase: IPurchaseStore = {
                ...purchase,
                purchase_date: new Date(),
            }

            const insert = this.db(storePurchase, 'user_id', 'product_id', 'purchase_date');
            await this.db<IPurchaseStore[]>`INSERT INTO purchases ${insert}`;
            return purchase;
        } catch (error: any) {
            Logger("ERROR", "PURCHASE_STORE", error.message);
            return null;
        }
    }
}
