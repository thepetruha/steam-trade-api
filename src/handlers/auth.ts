import { Request, Response } from "express";
import UserStore, { IUserRegister, IUserStoreResponse } from "../store/users";
import Handler, { Status } from ".";
import Logger from "../utils/logger";
import { comparePasswords, hashPassword } from "../utils/hasher";

export default class AuthHandler extends Handler {
    private usersStore: UserStore;

    constructor() {
        super();
        this.usersStore = new UserStore();
    }

    public async handleRegist(req: Request, res: Response) {
        try {
            const userRegisterData = req.body as IUserRegister;

            if (!this.isValidLogin(userRegisterData.login)) {
                this.response(res, Status.BadRequest, null, "Invalid login. Login must be 3-50 characters long and contain only letters, digits, and underscores.");
                return;
            }

            if (!this.isValidPassword(userRegisterData.password)) {
                this.response(res, Status.BadRequest, null,"Invalid password. Password must be at least 8 characters long, include at least one number, one uppercase letter, and one special character.")
                return;
            }

            const foundUser = await this.usersStore.findUserByLogin(userRegisterData.login);
            if (foundUser) {
                this.response(res, Status.BadRequest, null,"User is exists")
                return; 
            }

            const userCreated = await this.usersStore.create(userRegisterData);
            if (!userCreated) throw new Error("Failed create user"); 
            
            this.response(res, Status.Ok, {
                userId: userCreated.id,
                login: userCreated.login,
                balanceEUR: userCreated.balance_eur,
            });
        } catch (error) {
            Logger("ERROR", "AUTH_HANDLER", "Error in handleCreate:", error);
            this.response(res, 500, null, "Internal Server Error")
        }
    }

    public async handleChangePassword(req: Request, res: Response) {
        try {
            const { password = "", user } = req.body as { password: string, user: IUserStoreResponse };
            
            if (password === "") {
                this.response(res, Status.BadRequest, null, "Require password");
                return; 
            }

            const isPasswordsEquel = await comparePasswords(password, user.password_hash);
            
            if (isPasswordsEquel) {
                this.response(res, Status.BadRequest, null, "The password has not changed");
                return;
            }

            const hashedPassword = await hashPassword(password);
            const updatedUser = await this.usersStore.updatePassword(user.login, hashedPassword);
            if (!updatedUser) throw new Error("Unknown error");

            this.response(res, Status.Ok, {
                passwordUpdated: true 
            });
        } catch (error) {
            Logger("ERROR", "AUTH_HANDLER", "Error in handleCreate:", error);
            this.response(res, 500, null, "Internal Server Error")
        }
    }

    private isValidLogin(login: string): boolean {
        const loginRegex = /^[a-zA-Z0-9_]{3,50}$/; // Только буквы, цифры и подчеркивания, длина 3-50 символов
        return loginRegex.test(login);
    }

    private isValidPassword(password: string): boolean {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*_]{8,}$/; //Минимум 8 символов, хотя бы одна цифра, одна заглавная буква и один специальный символ
        return passwordRegex.test(password);
    }
}
