import postgres, { TransactionSql } from "postgres";
import Store from ".";
import Logger from "../utils/logger";
import { hashPassword } from "../utils/hasher";

export interface IUserStore extends IUser {
    balance_eur: number;
    reserved_balance: number;
    updated_at: Date;
    created_at: Date;
}

export interface IUserStoreResponse extends IUserStore {
    id: number;
}

export interface IUser {
    login: string;
    password_hash: string;
}

export interface IUserRegister {
    login: string;
    password: string;
}

export default class UserStore {
    private db: postgres.Sql;

    constructor() {
        this.db = Store.getInstance().getDatabase();
    }

    public getDB() {
        return this.db
    }

    public async create(user: IUserRegister): Promise<IUserStoreResponse | null> {
        try {
            const storeUser: IUserStore = {
                ...user,
                balance_eur: 0,
                reserved_balance: 0,
                password_hash: await hashPassword(user.password),
                created_at: new Date(),
                updated_at: new Date(),
            }

            const insert = this.db(storeUser, 'login', 'password_hash', 'balance_eur', 'reserved_balance', 'created_at', 'updated_at');
            const createdUser = await this.db<IUserStoreResponse[]>`
                INSERT INTO users ${insert} 
                RETURNING *
            `;

            if (createdUser.length === 0) {
                return null;
            }

            return createdUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        }
    }

    public async updatePassword(login: string, passwordHash: string) {
        try {
            const updatedUser = await this.db<IUserStoreResponse[]>`
                UPDATE users 
                SET password_hash = ${passwordHash}, updated_at = ${new Date()} 
                WHERE login = ${login} 
                RETURNING *
            `;

            if (updatedUser.length === 0) {
                return null;
            }

            return updatedUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        }
    }

    public async findUserByLogin(login: string): Promise<IUserStoreResponse | null> {
        try {
            const foundUser = await this.db<IUserStoreResponse[]>`
                SELECT * FROM users 
                WHERE login = ${login} 
                LIMIT 1
            `;

            if (foundUser.length === 0) {
                return null;
            }

            return foundUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        }
    }

    public async findById(user_id: number) {
        try {
            const foundUser = await this.db<IUserStoreResponse[]>`
                SELECT * FROM users 
                WHERE id = ${user_id}
                LIMIT 1
            `;

            if (foundUser.length === 0) {
                return null;
            }

            return foundUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        }
    }

    public async updateBalanceById(user_id: number, newBalance: number): Promise<IUserStoreResponse | null> {
        try {
            const updatedUser = await this.db<IUserStoreResponse[]>`
                UPDATE users 
                SET balance_eur = ${newBalance}, updated_at = ${new Date()} 
                WHERE id = ${user_id} 
                RETURNING *
            `;
    
            if (updatedUser.length === 0) {
                return null;
            }
    
            return updatedUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        }
    }

    public async update(user_id: number, user: IUserStore): Promise<IUserStoreResponse | null> {
        try {
            const { balance_eur, reserved_balance } = user;
    
            if (!user_id) {
                throw new Error("User ID is required for update");
            }
    
            const updatedUser = await this.db<IUserStoreResponse[]>`
                UPDATE users 
                SET 
                    balance_eur = COALESCE(${balance_eur}, balance_eur),
                    reserved_balance = COALESCE(${reserved_balance}, reserved_balance),
                    updated_at = ${new Date()}
                WHERE id = ${user_id} 
                RETURNING *;
            `;
    
            if (updatedUser.length === 0) {
                return null; 
            }
    
            return updatedUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", `Failed to update user: ${error.message}`);
            return null;
        }
    }

    public async reserveBalance(user_id: number, amount: number, trx?: postgres.TransactionSql<{}>): Promise<IUserStoreResponse | null> {
        try {
            if (amount <= 0) {
                throw new Error("Amount to reserve must be greater than 0");
            }

            const user = await this.findById(user_id);
            if (!user) {
                Logger("ERROR", "USER_STORE", `User with ID ${user_id} not found`);
                return null;
            }
    
            if (user.balance_eur < amount) {
                Logger("ERROR", "USER_STORE", `Insufficient balance for user ID ${user_id}`);
                return null;
            }

            const db = trx || this.db
            const updatedUser = await db<IUserStoreResponse[]>`
                UPDATE users 
                SET 
                    balance_eur = balance_eur - ${amount}, 
                    reserved_balance = reserved_balance + ${amount}, 
                    updated_at = ${new Date()}
                WHERE id = ${user_id} 
                RETURNING *;
            `;
   
            if (updatedUser.length === 0) {
                return null;
            }
    
            return updatedUser[0] 
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", `Failed to reserve balance for user ID ${user_id}: ${error.message}`);
            return null;
        }
    }

    public async deductReservedBalance(user_id: number, total_price: number, trx?: postgres.TransactionSql<{}>): Promise<IUserStoreResponse | null> {
        try {
            if (total_price <= 0) {
                throw new Error("Total price must be greater than 0");
            }
           
            const db = trx || this.db
            const updatedUser = await db<IUserStoreResponse[]>`
                UPDATE users 
                SET 
                    reserved_balance = reserved_balance - ${total_price},
                    updated_at = ${new Date().toISOString()}
                WHERE id = ${user_id}
                    AND reserved_balance >= ${total_price} 
                RETURNING *;
            `;

            if (updatedUser.length === 0) {
                throw new Error(`Failed to deduct reserved balance for user ID ${user_id}`);
            }

            return updatedUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", `Failed to deduct reserved balance: ${error.message}`);
            return null;
        }
    }
}
