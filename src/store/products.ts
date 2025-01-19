import postgres from "postgres";
import Store from ".";
import Logger from "../utils/logger";

export interface IProductStoreResponse extends IProductStore {
    id: number;
}

export interface IProductStore extends IProduct {
    created_at: Date;
}

export interface IProduct {
    name: string;
    price: number;
}


export default class ProductStore {
    private db: postgres.Sql;

    constructor() {
        this.db = Store.getInstance().getDatabase();
    }

    public async create(product: IProduct) {
        try {
            const storePurchase: IProductStore = {
                ...product,
                created_at: new Date(),
            }

            const insert = this.db(storePurchase, 'name', 'price', 'created_at');
            await this.db<IProductStore[]>`INSERT INTO products ${insert}`;
            return product;
        } catch (error: any) {
            Logger("ERROR", "PRODUCT_STORE", error.message);
            return null;
        }
    }
}
