import postgres from "postgres";
import config from "../configs/config";
import Logger from "../utils/logger";

const NUM_OF_CONNECTION = 3;

export default class Store {
    private static instance: Store;
    public database!: postgres.Sql;
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

    public getDatabase() {
        if (!this.database) {
            throw new Error('Call connect() before getConnector()'); 
        }

        return this.database;
    }

    public async connect() { 
        try {
            this.countConnection++;

            const pg = postgres({
                user: config.postgresUser,
                password: config.postgresPassword,
                database: config.postgresDatabase,
                host: config.postgresHost
            });

            this.database = pg;

            Logger("INFO", "POSTGRESQL", "PostgreSQL client is already connected.")
        } catch (error) {
            if (this.countConnection === NUM_OF_CONNECTION) {
                Logger("ERROR", "POSTGRESQL", "PostgreSQL client is already connected1.")
                process.exit(1);
            }

            await this.connect();
        }
    }
}