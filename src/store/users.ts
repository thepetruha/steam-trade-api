import { Collection, ObjectId, WithId } from "mongodb";
import Store from ".";

export interface IUserStore {
   username: string;
   firstName?: string;
   lastName?: string;
   avatar?: string;
   publicKey: string;
   createAt: number;
   lastLogin: number;
   contacts: ObjectId[];
}

export interface ISearchUsers extends IUserStore { isContact: boolean }; 

export default class Users {
    private collection: Collection<IUserStore>;

    constructor() {
        const db = Store.getInstance().getDatabase();
        this.collection = db.collection<IUserStore>("Users"); 
    }

    public async create(user: IUserStore): Promise<WithId<IUserStore> | null> {
        try {
            const foundUser = await this.collection.findOne({
                $or: [
                    { publicKey: user.publicKey },
                    { username: user.username }
                ] 
            });

            if (foundUser) throw new Error('User exists');
            await this.collection.insertOne(user);   
            return await this.collection.findOne({
                $and: [
                    { publicKey: user.publicKey },
                    { username: user.username } 
                ]
            });
        } catch (error) {
            console.error("[STORE]", error);
            return null;
        }
    }

    public async findByUsername(username: string, included?: boolean): Promise<WithId<IUserStore> | null> {
        try {
            const foundUser = await this.collection.findOne({
                username
            });

            if (!foundUser) throw new Error("User not found");
            return foundUser;
        } catch (error) {
            console.error("[STORE]", error);
            return null;
        }
    }

    public async findUsersByValue(myId: string, username: string): Promise<WithId<IUserStore>[] | null> {
        try {
            const foundUsers = await this.collection.find({
                username: { $regex: username },
                _id: { $ne: ObjectId.createFromHexString(myId) }
                // _id: { $nin: contacts }   
            }).toArray();
    
            if (foundUsers.length === 0) throw new Error("User not found");
            return foundUsers;
        } catch (error) {
            console.error("[STORE]", error);
            return null;
        }
    }

    public async findByPublicKey(publicKey: string): Promise<WithId<IUserStore> | null> {
        try {
            const foundUser = await this.collection.findOne({
                publicKey
            });

            if (!foundUser) throw new Error("User not found");
            return foundUser;
        } catch (error) {
            console.error("[STORE]", error);
            return null;
        }
    }

    public async findByUserId(userId: string): Promise<WithId<IUserStore> | null> {
        try {
            const foundUser = await this.collection.findOne({
                _id: ObjectId.createFromHexString(userId) 
            });

            if (!foundUser) throw new Error("User not found");
            return foundUser;
        } catch (error) {
            console.error("[STORE]", error);
            return null;
        } 
    }

    public async addContact(myId: string, contactId: string): Promise<boolean | null> {
        try {
            if (myId === contactId) throw new Error("You cannot add yourself");

            const foundById = await this.findByUserId(contactId);
            if (!foundById) throw new Error("User not found");

            const foundMe = await this.findByUserId(myId);
            if (!foundMe) throw new Error("User not found");

            const isContact: boolean = foundMe.contacts?.some((contactId) => 
                contactId.toHexString() === foundById._id.toHexString()
            ) || false;

            if (isContact) throw new Error("Contact has already been added");

            const addedContact = this.collection.findOneAndUpdate({
                _id: ObjectId.createFromHexString(myId)
            }, { 
                $set: { contacts: [foundById._id, ...foundMe?.contacts || []] }
            }, {
                upsert: false
            })

            return true;
        } catch (error) {
            console.error("[STORE]", error);
            return null;
        }
    }
}