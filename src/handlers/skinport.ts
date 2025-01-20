import { Request, Response } from "express";
import Handler, { Status } from ".";
import Skinport, { ISkinportItem } from "../api/skinport";
import RedisClient from "../redis";
import Redis from "ioredis";

export default class SkinportHandler extends Handler {
    private skinportApi: Skinport;
    private redisClient: Redis;

    constructor() {
        super();
        this.skinportApi = Skinport.getInstance();
        this.redisClient = RedisClient.getInstance().getConnect();
    }

    public async getItems(req: Request, res: Response) {
        try {
            const cacheKey = `items:tradable:true`;
            const cachedData = await this.redisClient.get(cacheKey);

            if (cachedData) {
                const parsedCachedData = JSON.parse(cachedData) as ISkinportItem[];
                this.response(res, Status.Ok, parsedCachedData)
                return;
            }

            const { body } = await this.skinportApi.getItems("USD"); 
            await this.redisClient.setex(cacheKey, 5 * 1000 * 60, JSON.stringify(body));
            
            res.setHeader("Cache-Control", "max-age=60000")
            this.response(res, Status.Ok, body);
        } catch (error) {
            console.error("Error in handleCreate:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}