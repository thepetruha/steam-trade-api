import postgres from "postgres";
import Store from ".";
import Logger from "../utils/logger";
import { IProductStoreResponse } from "./products";

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

export interface INewPurchase { 
    quantity: number, 
    totalPrice: number, 
    product: IProductStoreResponse, 
}

export default class PurchaseStore {
    private db: postgres.Sql;

    constructor() {
        this.db = Store.getInstance().getDatabase();
    }

    public async create(purchase: IPurchase, trx?: postgres.TransactionSql<{}>): Promise<IPurchaseStoreResponse | null> {
        try {
            const storePurchase: IPurchaseStore = {
                ...purchase,
                purchase_date: new Date(),
            }

            const db = trx || this.db
            const insert = db(
                storePurchase, 
                'user_id', 
                'product_id', 
                'quantity', 
                'total_price', 
                'purchase_date'
            );

            const purchasedRecord = await db<IPurchaseStoreResponse[]>`
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
