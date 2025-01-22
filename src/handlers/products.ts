import { Request, Response } from "express";
import Handler, { Status } from ".";
import ProductStore, { IProductStoreResponse } from "../store/products";
import PurchaseStore, { INewPurchase } from "../store/purchases";
import UserStore, { IUserStoreResponse } from "../store/users";
import postgres from "postgres";
import Logger from "../utils/logger";

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
    
            if (!user || !product_id || !quantity || quantity <= 0) {
                this.response(res, Status.BadRequest, null, "Invalid input");
                return;
            }
    
            const product = await this.productStore.findById(product_id);
            if (!product) {
                this.response(res, Status.NotFound, null, "Product not found");
                return;
            }
    
            if (product.quantity < quantity) {
                this.response(res, Status.BadRequest, null, "Insufficient stock");
                return;
            }
    
            const totalPrice = product.price * quantity;
            if (Number(user.balance_eur) < Number(totalPrice)) {
                this.response(res, Status.BadRequest, null, "Insufficient balance");
                return;
            }

            const resultTransaction = await this.userStore.getDB().begin((sql) => {
                return this.purchaseProduct(sql, user, {
                    totalPrice,
                    quantity,
                    product
                });
            }); 

            if (!resultTransaction) {
                this.response(res, Status.InternalServerError, null, "Failed make transaction"); 
                return;
            }

            const { purchase, updatedUser } = resultTransaction;

            this.response(res, Status.Ok, { 
                purchase: purchase, 
                newUserBalance: updatedUser.balance_eur,
            });
        } catch (error: any) {
            Logger("ERROR", "REQUEST_PRUCHASE_PRODUCT", error.message);
            this.response(res, Status.InternalServerError, null, "Internal server error");
        }
    }

    private async purchaseProduct(
        sql: postgres.TransactionSql<{}>, 
        user: IUserStoreResponse,
        newPurchase: INewPurchase
    ) {
        // 1. Резервируем баланс пользователя для будущего списания (когда все манипуляции с другими таблицами будут завершины)
        const reservedBalance = await this.userStore.reserveBalance(
            user.id, 
            newPurchase.totalPrice, 
            sql
        );

        if (!reservedBalance) {
            throw new Error("Failed to reserve balance");
        }

        // 2. Уменьшаем количество товаров в наличии по его ID
        const isUpdateStock = await this.productStore.updateStockWithCondition(
            newPurchase.product.id, 
            newPurchase.quantity,
            sql
        );

        if (!isUpdateStock) {
            throw new Error(`Failed to update stock for product ID ${newPurchase.product.id}`);
        }

        // 3. Создаем запись в таблице с покупками
        const purchase = await this.purchaseStore.create({
            quantity: newPurchase.quantity,
            product_id: newPurchase.product.id,
            total_price: newPurchase.totalPrice,
            user_id: user.id,
        }, sql);

        // 4. Списываем окончательно средства (или завершаем резервирование)
        const updatedUser = await this.userStore.deductReservedBalance(
            user.id, 
            newPurchase.totalPrice, 
            sql
        );

        //Будущие доработки
        // - поддеркжа потверждение через прилжоение или Email, Phone...
        // - разделение на стадии покупк (пользователь нажимает купить, у него резервируется средства. Система ожидает потвержедния. Потом шаг списания)

        if (!updatedUser) {
            throw new Error("Failed to finalize balance deduction");
        }

        return { 
            reservedBalance, 
            isUpdateStock, 
            purchase, 
            updatedUser
        }
    }
}