import { Request, Response } from "express";
import Users, { ISearchUsers, IUserStore } from "../store/users";

export default class UsersHandler {
    private usersStore: Users;

    constructor() {
        this.usersStore = new Users();
    }

    public async handleCreate(req: Request, res: Response) {
        try {
            const body = req.body as (IUserStore | undefined);

            console.log("CReate user: ", body)

            if (!body || Object.keys(body).length === 0) {
                res.status(400).json({ 
                    status: "error", 
                    message: "Data not found" 
                });
                return;
            }

            if (!body?.username || body?.username === "") {
                res.status(400).json({ 
                    status: "error", 
                    message: "Not found username" 
                });
                return;
            }

            if (!body?.publicKey || body?.publicKey === "") {
                res.status(400).json({ 
                    status: "error", 
                    message: "Not found publicKey" 
                });
                return;
            } 

            if (body?.username.length > 30) {
                res.status(400).json({
                    status: "error",
                    message: "Username is very long"
                });
                return;
            }

            const newUserData = body as IUserStore;
            const createdUser = await this.usersStore.create(newUserData);
            if (!createdUser) {
                res.status(400).json({
                    status: "error",
                    message: "Username or PublicKey exists"
                });
                return;
            }

            res.status(200).json({
                status: "ok",
                message: "User created",
                data: createdUser,
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }

    public async handleFindByUsername(req: Request, res: Response) {
        try {
            const username = req.params?.username || "";

            if (username === "") {
                res.status(400).json({
                    stats: "error",
                    message: "Bad reqeust"
                });
                return;
            }


            const foundUser = await this.usersStore.findByUsername(username);
            if (!foundUser) {
                res.status(404).json({
                    status: "error",
                    message: "Not found"
                });
                return;
            }

            res.status(200).json({
                status: "ok",
                data: foundUser,
            });
        } catch (error: any) {
            res.status(500).json({
                stats: "error",
                message: error.message
            });
        }
    }

    public async handleFindUsers(req: Request, res: Response) {
        try {
            const value = req.params?.value || "";
            const userId = req.body?.userId as string;

            if (value === "") {
                res.status(400).json({
                    stats: "error",
                    message: "Bad reqeust"
                });
                return;
            }

            const myUser = await this.usersStore.findByUserId(userId);
            if (!myUser) {
                res.status(200).json({
                    status: "ok",
                    data: [],
                });
                return; 
            }

            const foundUsers = await this.usersStore.findUsersByValue(userId, value);
            if (!foundUsers) {
                res.status(404).json({
                    status: "error",
                    message: "Not found"
                });
                return;
            }
        
            const arrayUsers: ISearchUsers[] = foundUsers.map((item) => {
                const isContact = myUser.contacts?.some((contactId) => contactId.toHexString() === item._id.toHexString()) || false;
                return { ...item, isContact };
            });


            res.status(200).json({
                status: "ok",
                data: arrayUsers,
            });
        } catch (error: any) {
            res.status(500).json({
                stats: "error",
                message: error.message
            });
        }
    }

    public async handleAddContact(req: Request, res: Response) {
        try {
            const body = req.body as ({ contactId: string } | undefined);
            const userId = req.body?.userId as string;

            if (!body?.contactId || !userId || body?.contactId === "") {
                res.status(400).json({ 
                    status: "error", 
                    message: "Data not found" 
                });
                return;
            } 

            const addedContact = await this.usersStore.addContact(userId, body?.contactId);
            if (!addedContact) {
                res.status(400).json({ 
                    status: "error", 
                    message: "Contact already exists" 
                });
                return;
            }

            res.status(200).json({
                status: "ok",
            });
        } catch (error: any) {
            res.status(500).json({
                stats: "error",
                message: error.message
            });
        }
    }

    public async handleFindByAuth(req: Request, res: Response) {
        try {
            const userId = req.body?.userId as string;
            const foundUser = await this.usersStore.findByUserId(userId);
            if (!foundUser) {
                res.status(404).json({
                    "status": "error",
                    "data": null,
                });
                return; 
            }

            res.status(200).json({
                "status": "ok",
                "data": foundUser
            });
        } catch (error: any) {
            res.status(505).json({
                "status": "error",
                "data": null,
            });
        }
    }
}