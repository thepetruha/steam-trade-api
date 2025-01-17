import { Request, Response } from "express";
import Chats, { IChatsStore } from "../store/chats";

export default class ChatsHandler {
    private chatsStore: Chats;

    constructor() {
        this.chatsStore = new Chats();
    }

    public async handleCreate(req: Request, res: Response) {
        try {
            const body = req.body as IChatsStore | undefined;

            if (!body) {
                res.status(400).json({ 
                    error: "ok", 
                    message: "Bad request" 
                });
                return;
            }
            
            const createdChat = await this.chatsStore.create(body);
            if (!createdChat) {
                res.status(500).json({ 
                    error: "ok", 
                    message: "Internal Errror" 
                });
                return;
            }

            res.status(200).json({
                status: "ok",
                message: "Chat created",
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }

    public async handleGetChatById(req: Request, res: Response) {
        try {
            const { chatId } = req.params || null;

            if (!chatId || chatId === "") {
                res.send(400).json({
                    status: "error",
                    message: "Failed get chatId",
                });
                return;
            }

            const foundChat = await this.chatsStore.getChatById(chatId) || [];
            if (!foundChat) {
                res.send(404).json({
                    status: "error",
                    message: "Not found chat"
                });
                return;
            }

            res.status(200).json({
                status: "ok",
                data: foundChat
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        } 
    }

    public async handleGetChats(req: Request, res: Response) {
        try {
            const chats = await this.chatsStore.getChats() || [];

            res.status(200).json({
                status: "ok",
                data: chats
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        } 
    }

    public async handleGetMyChats(req: Request, res: Response) {
        try { 
            const userId = req?.body?.userId as string;
            const chats = await this.chatsStore.getMyChats(userId) || [];

            res.status(200).json({
                status: "ok",
                data: chats
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        } 
    }
}