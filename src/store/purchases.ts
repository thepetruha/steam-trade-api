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
    total_price: number;
    quantity: number;
}

export default class PurchaseStore {
    private db: postgres.Sql;

    constructor() {
        this.db = Store.getInstance().getDatabase();
    }

    public async create(purchase: IPurchase): Promise<IPurchaseStoreResponse | null> {
        try {
            const storePurchase: IPurchaseStore = {
                ...purchase,
                purchase_date: new Date(),
            }

            const insert = this.db(storePurchase, 'user_id', 'product_id', 'quantity', 'total_price', 'purchase_date');

            const purchasedRecord = await this.db<IPurchaseStoreResponse[]>`
                INSERT INTO purchases ${insert} 
                RETURNING *
            `;

            if (purchasedRecord.length === 0) {
                return null;
            }

            return purchasedRecord[0];
        } catch (error: any) {
            Logger("ERROR", "PURCHASE_STORE", error.message);
            return null;
        }
    }
}
