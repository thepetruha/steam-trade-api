import { Request, Response } from "express";
import Handler, { Status } from ".";
import Skinport, { ISkinportItem, isValidCurrency } from "../api/skinport";
import RedisClient from "../redis";
import Redis from "ioredis";


function getItemsWithMinPrices(items: ISkinportItem[]): Array<{ tradableMin: number; nonTradableMin: number }> {
    return items.map(item => {
        const tradablePrices = [item.min_price, item.max_price, item.mean_price, item.median_price]
            .filter(price => price !== null) as number[];
        const tradableMin = Math.min(...tradablePrices);
    
        const nonTradablePrices = [item.suggested_price]
            .filter(price => price !== null) as number[];
        const nonTradableMin = Math.min(...nonTradablePrices);
    
        return {
            marketName: item.market_hash_name,
            createAt: item.created_at,
            updatedAt: item.updated_at,
            quantity: item.quantity,
            currency: item.currency,
            tradableMin,
            nonTradableMin,
        };
    });
}

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
            const { app_id = 730, currency = "EUR" } = req.query || {};

            const inAppId = Number(app_id);

            if (Number.isNaN(inAppId)) {
                throw new Error("Incorrect parametrs - appId");
            }

            const cacheKey = `items:${app_id}:currncy:${currency}`;
            const cachedData = await this.redisClient.get(cacheKey);

            if (cachedData) {
                const parsedCachedData = JSON.parse(cachedData) as ISkinportItem[];
                this.response(res, Status.Ok, parsedCachedData)
                return;
            } 

            const isParamCurrncy = isValidCurrency(String(currency));
            if (!isParamCurrncy) {
                throw new Error("Incorrect parametrs - currncy");
            }

            const { body } = await this.skinportApi.getItems(inAppId, String(currency));
            const processedItems = getItemsWithMinPrices(body);
            await this.redisClient.setex(cacheKey, 5 * 1000 * 60, JSON.stringify(processedItems));
            
            res.setHeader("Cache-Control", "max-age=60000")
            this.response(res, Status.Ok, processedItems);
        } catch (error) {
            console.error("Error in handleCreate:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}