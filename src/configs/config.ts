import dotenv from "dotenv";
import path from "path";

const envName = process.env.NODE_ENV || "development";
const filename = `.env.${envName}`
const pathEnv = path.join(__dirname, `../../${filename}`);

dotenv.config({ path: pathEnv });

export default {
    httpServerPort:             Number(process.env.HTTP_SERVER_PORT || 4343), 
    skinportApiClientId:        process.env.SKINPORT_API_CLIENT_ID,
    slinportApiClientSecret:    process.env.SKINPORT_API_CLIENT_SECRET,
    redisUser:                  process.env.REDIS_USER,
    redisPassword:              process.env.REDIS_PASSWORD,
    redisHost:                  process.env.REDIS_HOST,
    redisPort:                  Number(process.env.REDIS_PORT || 6379),
    postgresUser:               process.env.POSTGRES_USER,
    postgresPassword:           process.env.POSTGRES_PASSWORD,
    postgresPort:               Number(process.env.POSTGRES_PORT || 5432),
    postgresHost:               process.env.POSTGRES_HOST,
    postgresDatabase:           process.env.POSTGRES_DB,
}