import { Request, Response } from "express";
import Messages, { IMessagesStore } from "../store/messages";

export default class MessagesHandler {
    private messagesStore: Messages;

    constructor() {
        this.messagesStore = new Messages();
    }

    public async handleCreate(req: Request, res: Response) {
        try {
            const body = req.body as IMessagesStore | undefined;

            if (!body) {
                res.status(400).json({ 
                    status: "error",
                    message: "Bad request" 
                });
                return;
            }
            
            await this.messagesStore.create(body);

            res.status(200).json({ 
                status: "ok" 
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }

    public async handleGetByRoomId(req: Request, res: Response) {
        try {
            const userId = req.body.userId as string;
            const { roomId } = req.params || null; 

            if (!roomId) {
                res.status(400).json({ 
                    status: "error",
                    message: "Bad request" 
                });
                return;
            }
            
            const messages = await this.messagesStore.getByRoomId(roomId, userId);

            res.status(200).json({ 
                status: "ok",
                data: messages
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }
}