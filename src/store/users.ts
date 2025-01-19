import postgres from "postgres";
import Store from ".";
import Logger from "../utils/logger";

export interface IUserStore extends IUser {
    is_active: boolean;
    updated_at: Date;
    created_at: Date;
}

export interface IUserStoreResponse extends IUserStore {
    id: number;
}

export interface IUser {
    login: string;
    password_hash: string;
    email: string;
}

export interface IUserRegister {
    login: string;
    email: string;
    password: string;
}

export default class UserStore {
    private db: postgres.Sql;

    constructor() {
        this.db = Store.getInstance().getDatabase();
    }

    public async create(user: IUser) {
        try {
            const storeUser: IUserStore = {
                ...user,
                created_at: new Date(),
                updated_at: new Date(),
                is_active: true
            }

            const insert = this.db(storeUser, 'login', 'password_hash', 'email', 'is_active', 'created_at', 'updated_at');
            await this.db<IUserStore[]>`INSERT INTO users ${insert}`;
            return storeUser;
        } catch (error: any) {
            Logger("ERROR", "USER_STORE", error.message);
            return null;
        }
    }

    public async updatePassword() {

    }

    public async findUserByEmail() {

    }

    public async findUserByLogin() {

    }    
}
