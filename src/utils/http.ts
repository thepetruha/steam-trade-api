import config from "../configs/config";

class HTTP {
    protected static instance: HTTP;
    protected host: string = "";

    protected constructor(host: string) {
        this.host = host;
    }

    public static init(host: string) {
       if (!this.instance) {
            this.instance = new HTTP(host);
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

    private getAuthorizationKeys() {
        const skinportClientId = config.skinportApiClientId;
        const skinportClientSecret = config.skinportApiClientSecret;

        if (!skinportClientId || !skinportClientSecret) {
            throw new Error("Failed get TON API KEY");
        }

        const skinportAuthKey = Buffer.from(skinportClientId + ":" + skinportClientSecret);
        return { skinportAuthKey };
    }

    public async request(endpoint: string, inConf?: RequestInit) {
        const { skinportAuthKey } = this.getAuthorizationKeys();

        const options = {
            ...inConf,
            headers: {
                ...inConf?.headers,
                "Authorization": "Basic " + skinportAuthKey
            }
        }
        
        const reqURL = this.host + endpoint;
        const response = await fetch(reqURL, options);

        if (!response.ok || response.status !== 200) {
           throw new Error("Failed reqeust or sent data on server!"); 
        }

        const body = await response.json(); 
        return { status: response.status, body }; 
    }
}

export default HTTP;