import { Collection, ObjectId, WithId } from "mongodb";
import Store from ".";

export interface IChatsStore {
    admins: string[]; //сделать ObjectID
    participants: string[]; //сделать ObjectID
    participantsPublicKeys: string[]; 
    isPublic: boolean;
    name: string;
    title: string;
    description: string;
}


export default class Chats {
    private collection: Collection<IChatsStore>;

    constructor() {
        const db = Store.getInstance().getDatabase();
        this.collection = db.collection<IChatsStore>("Chats"); 
    }

    public async create(chatData: IChatsStore) {
        try {
            const foundChatByName = await this.collection.findOne({ 
                name: chatData.name 
            });

            if (foundChatByName) throw new Error('Chat name exists');
            const insertedChat = await this.collection.insertOne({
                ...chatData
            });

            const chat = await this.collection.findOne({ 
                _id: insertedChat.insertedId, 
            });

            return chat; 
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async getChatById(chatId: string) {
        try {
            const foundChat = await this.collection.findOne({
                _id: ObjectId.createFromHexString(chatId)
            });

            if (!foundChat) throw new Error("Not found chat by ID");
            return foundChat; 
        } catch (error) {
            console.error(error);
            return null;
        } 
    }

    public async getChats() {
        try {
            const chats = await this.collection.find().toArray();
            return chats; 
        } catch (error) {
            console.error(error);
            return null;
        } 
    }

    public async getMyChats(userId: string) {
        try {
            // Преобразуем строку userId в ObjectId для поиска
            // const userObjectId = new ObjectId(userId);
    
            // Ищем чаты, где указанный пользователь находится в массиве participants
            const foundChats = await this.collection.find({
                participants: { $in: [userId] }
            }).toArray();
   
            if (!foundChats.length) {
                console.log("No chats found for this user.");
                return null;
            }
    
            return foundChats; 
        } catch (error) {
            console.error("Error fetching chats:", error);
            return null;
        } 
    }
}
