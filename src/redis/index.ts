import Redis from "ioredis";
import Logger from "../utils/logger";
import config from "../configs/config";

class RedisClient {
    private static instance: RedisClient;
    private client: Redis;

    constructor() {
        this.client = new Redis({
            port: config.redisPort,
            host: config.redisHost,
            // username: config.redisUser,
            // password: config.redisPassword,
        });
    }

    public static init() {
        if (!this.instance) {
            this.instance = new RedisClient();
        }

        return this.instance;
    }

    public static getInstance() {
        if (!this.instance) {
            throw new Error('Call init() before getInstance()');
        }

        return this.instance;
    }

    public async connect() {
        try {
            if (this.client.status === 'ready') {
                Logger("INFO", "REDIS", "Redis client is already connected.");
                this.client.set("test", "value")
                return;
            }
    
            if (this.client.status === 'connecting') {
                Logger("INFO", "REDIS", "Redis client is already connecting.");
                this.client.set("test", "value")
                return;
            }
    
            await this.client.connect();
            Logger("INFO", "REDIS", "Redis client connected successfully.");
        } catch (error: any) {
            Logger("ERROR", "REDIS", error.message);
        }
    }
}

export default RedisClient;