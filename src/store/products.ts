import postgres from "postgres";
import Store from ".";
import Logger from "../utils/logger";

export interface IProductStoreResponse extends IProductStore {
    id: number;
}

export interface IProductStore extends IProduct {
    created_at: Date;
    updated_at: Date;
    quantity: number;
    currncy: string;
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

    public async findById(product_id: number): Promise<IProductStoreResponse | null> {
        try {
            const foundProduct = await this.db<IProductStoreResponse[]>`
                SELECT * FROM products WHERE id = ${product_id} LIMIT 1
            `;

            if (foundProduct.length === 0) {
                return null;
            }

            return foundProduct[0];
        } catch (error: any) {
            Logger("ERROR", "PRODUCT_STORE", error.message);
            return null;
        }
    }

    public async updateStock(product_id: number, newStock: number): Promise<boolean> {
        try {
            const updatedProduct = await this.db`
                UPDATE products
                SET quantity = ${newStock}, updated_at = ${new Date()}
                WHERE id = ${product_id}
            `;
            
            return updatedProduct.count > 0;
        } catch (error: any) {
            Logger("ERROR", "PRODUCT_STORE", error.message);
            return false;
        }
    }

    public async create(product: IProduct): Promise<IProductStoreResponse | null> {
        try {
            const storeProduct: IProductStore = {
                ...product,
                created_at: new Date(),
                updated_at: new Date(),
                quantity: 0,
                currncy: "EUR", // По умолчанию EUR, можно изменить на основе требований
            };

            const insert = this.db(storeProduct, "name", "price", "created_at", "updated_at", "quantity", "currncy");
            const createdProduct = await this.db<IProductStoreResponse[]>`
                INSERT INTO products ${insert}
                RETURNING *
            `;

            if (createdProduct.length === 0) {
                return null;
            }

            return createdProduct[0];
        } catch (error: any) {
            Logger("ERROR", "PRODUCT_STORE", error.message);
            return null;
        }
    }

    public async deleteById(product_id: number): Promise<boolean> {
        try {
            const deletedProduct = await this.db`
                DELETE FROM products WHERE id = ${product_id}
            `;

            return deletedProduct.count > 0;
        } catch (error: any) {
            Logger("ERROR", "PRODUCT_STORE", error.message);
            return false;
        }
    }
}