import dotenv from "dotenv";
import path from "path";

const envName = process.env.NODE_ENV || "development";
const filename = `.env.${envName}`

const pathEnv = path.join(__dirname, `../../${filename}`);
dotenv.config({ path: pathEnv });

export default {
    httpServerPort: Number(process.env.HTTP_SERVER_PORT || 4343), 
    skinportApiClientId: process.env.SKINPORT_API_CLIENT_ID,
    slinportApiClientSecret: process.env.SKINPORT_API_CLIENT_SECRET,
    redisUser:  process.env.REDIS_USER,
    redisPassword:  process.env.REDIS_PASSWORD,
    redisHost: "127.0.0.1",
    redisPort: 6379, 
    postgresUser:  process.env.POSTGRES_USER,
    postgresPassword:  process.env.POSTGRES_PASSWORD,
    postgresPort: 5432,
    postgresHost: "127.0.0.1",
    postgresDatabase: "SteamTradeApi"
}