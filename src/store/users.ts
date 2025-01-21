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
            const createdUser = await this.db<IUserStoreResponse[]>`INSERT INTO users ${insert} RETURNING *`;
            return createdUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        }
    }

    public async updatePassword() {

    }

    public async findUserByLogin(login: string): Promise<IUserStoreResponse | null> {
        try {
            const foundUser = await this.db<IUserStoreResponse[]>`SELECT * FROM users WHERE login = ${login} LIMIT 1`;
            return foundUser[0];
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        } 
    }    
}
