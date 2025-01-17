import { Collection, ObjectId, WithId } from "mongodb";
import Store from ".";

export interface IAuthStore {
    userId: ObjectId;
    authKey: string;
    refreshKey: string;
    ipAddress: string;
    device: string;
    expiresAt: number;
}

export default class Auth {
    private collection: Collection<IAuthStore>;

    constructor() {
        const db = Store.getInstance().getDatabase();
        this.collection = db.collection<IAuthStore>("Auth"); 
    }

    // Создание новой сессии
    public async create(authData: IAuthStore): Promise<boolean> {
        try {
            await this.collection.insertOne(authData);
            return true;
        } catch (error) {
            console.error("[STORE] Error creating session:", error);
            return false;
        }
    }

    // Удаление сессии по ID
    public async deleteById(sessionId: ObjectId): Promise<boolean> {
        try {
            const result = await this.collection.deleteOne({ _id: sessionId });
            return result.deletedCount === 1;
        } catch (error) {
            console.error("[STORE] Error deleting session:", error);
            return false;
        }
    }

    // Обновление authKey для сессии по ID
    public async updateAuthKey(sessionId: ObjectId, newAuthKey: string): Promise<boolean> {
        try {
            const result = await this.collection.updateOne(
                { _id: sessionId },
                { $set: { authKey: newAuthKey, expiresAt: Date.now() + 3600 * 1000 } } // Обновляем срок действия на 1 час
            );
            return result.modifiedCount === 1;
        } catch (error) {
            console.error("[STORE] Error updating auth key:", error);
            return false;
        }
    }

    // Поиск сессии по authKey
    public async findSessionByAuthKey(authKey: string): Promise<WithId<IAuthStore> | null> {
        try {
            const session = await this.collection.findOne({ authKey });
            return session;
        } catch (error) {
            console.error("[STORE] Error finding session by auth key:", error);
            return null;
        }
    }

    // Поиск сессии по refreshKey
    public async findSessionByRefreshKey(refreshKey: string): Promise<WithId<IAuthStore> | null> {
        try {
            const session = await this.collection.findOne({ refreshKey });
            return session;
        } catch (error) {
            console.error("[STORE] Error finding session by refresh key:", error);
            return null;
        }
    }
}
