import { Db, MongoClient } from "mongodb";

const MONGODB_URL = "mongodb://localhost:27017";
const MONGODB_DATABASE = "BabbleChat"
const NUM_OF_CONNECTION = 3;

export default class Store {
    private static instance: Store;
    public storeConnector!: MongoClient;
    public database!: Db;
    private countConnection: number = 0;

    public static init() {
        if (!this.instance) {
            this.instance = new Store();
        }

        return this.instance;
    }

    public static getInstance() {
        if (!this.instance) {
            throw new Error('Call init() before getInstance()');
        }

        return this.instance;
    }
    
    public getConnector() {
        if (!this.storeConnector) {
            throw new Error('Call connect() before getConnector()');
        }
            
        return this.storeConnector;    
    }

    public getDatabase() {
        if (!this.database) {
            throw new Error('Call connect() before getConnector()'); 
        }

        return this.database;
    }

    public async connect() { 
        try {
            this.countConnection++;
            const mongoClient = new MongoClient(MONGODB_URL);
            console.log(`[STORE] ${NUM_OF_CONNECTION}/${this.countConnection} Try connect to MongoDB`);
            this.storeConnector = await mongoClient.connect();
            this.database = this.storeConnector.db(MONGODB_DATABASE);
            console.log('[STORE] Success connected!');
        } catch (error) {
            if (this.countConnection === NUM_OF_CONNECTION) {
                console.error(error);
                process.exit(1);
            }

            await this.connect();
        }
    }
}