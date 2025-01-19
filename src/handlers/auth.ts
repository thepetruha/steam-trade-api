import { Request, Response } from "express";
import UserStore, { IUser, IUserRegister } from "../store/users";
import Handler, { Status } from ".";
import {hashPassword} from "../utils/hasher";

export default class AuthHandler extends Handler {
    private usersStore: UserStore;

    constructor() {
        super();
        this.usersStore = new UserStore();
    }

    public async handleCreate(req: Request, res: Response) {
        try {
            const userRegisterData = req.body as IUserRegister;

            const user: IUser = {
                email: userRegisterData.email,
                login: userRegisterData.login,
                password_hash: await hashPassword(userRegisterData.password), 
            }

            const userCreated = await this.usersStore.create(user);
            this.response(res, Status.Ok, { isCreated: userCreated !== null });
        } catch (error) {
            console.error("Error in handleCreate:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
