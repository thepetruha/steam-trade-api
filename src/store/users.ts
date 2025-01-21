import postgres from "postgres";
import Store from ".";
import Logger from "../utils/logger";
import { hashPassword } from "../utils/hasher";

export interface IUserStore extends IUser {
    balance_eur: number;
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

    public async create(user: IUserRegister): Promise<IUserStoreResponse | null> {
        try {
            const storeUser: IUserStore = {
                ...user,
                balance_eur: 0,
                password_hash: await hashPassword(user.password),
                created_at: new Date(),
                updated_at: new Date(),
            }

            const insert = this.db(storeUser, 'login', 'password_hash', 'balance_eur', 'created_at', 'updated_at');
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
}
