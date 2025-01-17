import { Request, Response, NextFunction } from "express";
import Auth from "../store/auth";
import jwt from "jsonwebtoken";
import Users from "../store/users";
import { encryptMessage } from "../utils/encryptWithPublicKey";

export default class AuthHandler {
    private authStore: Auth;
    private usersStore: Users;

    constructor() {
        this.authStore = new Auth();
        this.usersStore = new Users();
    }

    // Авторизация и создание сессии
    public async handleCreate(req: Request, res: Response) {
        try {
            const { publicKey } = req.body;

            if (!publicKey) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }

            const ipAddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || "");
            console.log('User IP:', ipAddress);

            if (ipAddress === "") {
                res.status(400).json({ message: "Missing required fields" });
                return; 
            }

            const userAgent = String(req.headers['user-agent'] || "");
            console.log('Device Agent:', userAgent);

            if (userAgent === "") {
                res.status(400).json({ message: "Missing required fields" });
                return; 
            }

            const user = await this.usersStore.findByPublicKey(publicKey);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;  
            }

            const authKey = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
            const refreshKey = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

            const expiresAt = Date.now() + 3600 * 1000;
            const session = await this.authStore.create({
                userId: user._id,
                authKey,
                refreshKey,
                ipAddress,
                device: userAgent,
                expiresAt
            });

            if (!session) {
                res.status(500).json({ message: "Failed to create session" });
                return;
            }

            const encryptedAuth = {
                encryptedAuthKey: encryptMessage(authKey, publicKey),
                refreshKey: encryptMessage(refreshKey, publicKey)
            }

            console.log(encryptedAuth)

            res.status(201).json({
                status: "ok",
                message: "Authentication successful",
                data: encryptedAuth
            });
        } catch (error) {
            console.error("Error in handleCreate:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async handleRefresh(req: Request, res: Response) {
        try {
            const { refreshKey } = req.body;

            if (!refreshKey) {
                res.status(400).json({
                    status: "error", 
                    message: "Missing refresh token"
                });
                return;
            }

            const decoded = jwt.verify(refreshKey, process.env.JWT_REFRESH_SECRET as string) as { userId: number };
            const { userId } = decoded;

            const session = await this.authStore.findSessionByRefreshKey(refreshKey);
            if (!session) {
                res.status(401).json({
                    status: "error", 
                    message: "Invalid refresh token" 
                });
                return;
            }

            const newAuthKey = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
            await this.authStore.updateAuthKey(session._id, newAuthKey);

            res.status(200).json({
                status: "ok",
                data: { authKey: newAuthKey } 
            });
        } catch (error) {
            console.error("Error in handleRefresh:", error);
            res.status(401).json({
                status: "error", 
                message: "Invalid or expired refresh token" 
            });
        }
    }

    public async handleLogout(req: Request, res: Response) {
        try {
            const { authKey } = req.body;

            if (!authKey) {
                res.status(400).json({
                    status: "error", 
                    message: "Missing auth token" 
                });
                return;
            }

            const session = await this.authStore.findSessionByAuthKey(authKey);
            if (!session) {
                res.status(401).json({ 
                    status: "error", 
                    message: "Invalid auth token" 
                });
                return;
            }

            await this.authStore.deleteById(session._id);
            res.status(200).json({ 
                status: "ok", 
                message: "Logged out successfully" 
            });
        } catch (error) {
            console.error("Error in handleLogout:", error);
            res.status(500).json({ 
                status: "error", 
                message: "Internal server error" 
            });
        }
    }
}
