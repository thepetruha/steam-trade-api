import { NextFunction, Request, Response } from "express";
import { comparePasswords, hashPassword } from "../utils/hasher";
import UserStore from "../store/users";

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = (req.headers as any)?.authorization || null;

        if (!authHeader) {
            res.status(401).json({ 
                status: "error", 
                message: "Authorization token missing" 
            });
            return;
        }
    
        const authDataBase64 = authHeader.split(" ")[1];
        const strCredData = atob(authDataBase64).split(":");
    
        const login = strCredData[0];
        const password = strCredData[1];

        if (login === "" || password === "") {
            throw new Error("Failed get Login or Password");
        }
    
        const store = new UserStore();
        const foundUser = await store.findUserByLogin(login);
        if (!foundUser) throw new Error("Failed find user");

        const isPasswordsEquel = await comparePasswords(password, foundUser.password_hash);
        if (isPasswordsEquel) {
            req.body.user = foundUser;
            next();
            return;
        }
        
        throw new Error("Password incorrect"); 
    } catch (error) {
        console.error("Error in authenticate:", error);
        res.status(401).json({ 
            status: "error", 
            message: "Invalid Login or Password" 
        });
    }
}