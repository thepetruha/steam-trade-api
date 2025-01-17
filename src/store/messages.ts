import { Collection, ObjectId, WithId } from "mongodb";
import Store from ".";

export interface IMessagesStore {
    fromUserId: ObjectId;
    toUserId: ObjectId; 
    content: any;
    chatId: ObjectId;
    createAt: number;
}

export default class Messages {
    private collection: Collection<IMessagesStore>;

    constructor() {
        const db = Store.getInstance().getDatabase();
        this.collection = db.collection<IMessagesStore>("Messages"); 
    }

    public async create(messageData: IMessagesStore) {
        try {
            const insertedData = await this.collection.insertOne({
                ...messageData
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    
    public async getByRoomId(roomId: string, userId: string) {
        try {
            const roomMongoId = ObjectId.createFromHexString(roomId);
            const myUserId = ObjectId.createFromHexString(userId);
            const messages = await this.collection.find({
                chatId: roomMongoId,
                $or: [
                    { toUserId: myUserId },
                    { fromUserId: myUserId }
                ], 
            }).toArray();

            return messages;
        } catch (error) {
            console.error(error);
        }
    } 
}
