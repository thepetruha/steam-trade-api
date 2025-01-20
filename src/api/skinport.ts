import HTTP from "../utils/http";

export interface ISkinportItem {
    market_hash_name: string;
    currency: "USD" | "EUR" | string;
    suggested_price: number;
    item_page: string; 
    market_page: string;
    min_price: number | null;
    max_price: number | null;
    mean_price: number | null;
    median_price: number | null;
    quantity: number;
    created_at: number;
    updated_at: number;
}

class Skinport extends HTTP {
    protected static instance: Skinport;

    constructor(host: string) {
        super(host);
    }

    public static init(host: string) {
       if (!this.instance) {
            this.instance = new Skinport(host);
            return this.instance;
       }

       return this.instance;
    }

    public static getInstance() {
        if (!this.instance) {
            throw new Error("Requere first call init() method");
        }

        return this.instance;
    }

    public async getItems(currency: "USD" | "EUR"): Promise<{ status: number, body: ISkinportItem[] }> {
        const endpoint = "/v1/items" + `?currency=${currency}` + `&tradable=${true}`;
        const { body, status } = await this.request(endpoint, {
            headers: { "Accept-Encoding": "br" }
        });
        return { body: body as ISkinportItem[], status };
    }

    public async sendTransaction(): Promise<void> {

    }
}

export default Skinport;