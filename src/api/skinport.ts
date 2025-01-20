import HTTP from "../utils/http";

export type TypeCurrencySkinport = "AUD" | "BRL" | "CAD" | "CHF" | "CNY" | "CZK" | "DKK" | "EUR" | "GBP" | "HRK" | "NOK" | "PLN" | "RUB" | "SEK" | "TRY" | "USD";

export type TypeCurrenctySP = TypeCurrencySkinport | TypeCurrencySkinportEnum | string;

export enum TypeCurrencySkinportEnum {
    AUD = "AUD",
    BRL = "BRL",
    CAD = "CAD",
    CHF = "CHF",
    CNY = "CNY",
    CZK = "CZK",
    DKK = "DKK",
    EUR = "EUR",
    GBP = "GBP",
    HRK = "HRK",
    NOK = "NOK",
    PLN = "PLN",
    RUB = "RUB",
    SEK = "SEK",
    TRY = "TRY",
    USD = "USD",
}
  
export function isValidCurrency(currency: string): currency is TypeCurrencySkinport {
    return Object.values(TypeCurrencySkinportEnum).includes(currency as TypeCurrencySkinportEnum);
}

export interface ISkinportItem {
    market_hash_name: string;
    currency: TypeCurrenctySP; 
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

    public async getItems(appId: number, currency: TypeCurrenctySP = "EUR"): Promise<{ status: number, body: ISkinportItem[] }> {
        const endpoint = "/v1/items" + 
            `?app_id=${appId}` + 
            `&currency=${currency}`;

        const { body, status } = await this.request(endpoint, {
            headers: { "Accept-Encoding": "br" }
        });

        return { body: body as ISkinportItem[], status };
    }

    public async sendTransaction(): Promise<void> {

    }
}

export default Skinport;