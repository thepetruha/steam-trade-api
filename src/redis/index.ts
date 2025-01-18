import Redis from "ioredis";
import Logger from "../utils/logger";

class RedisClient {
    private static instance: RedisClient;
    private client: Redis;

    constructor() {
        this.client = new Redis({
            port: 6379,
            host: "127.0.0.1",
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

    public async start() {
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