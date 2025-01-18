"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envName = process.env.NODE_ENV || "development";
const filename = `.env.${envName}`;
const pathEnv = path_1.default.join(__dirname, `../../${filename}`);
dotenv_1.default.config({ path: pathEnv });
exports.default = {
    httpServerPort: Number(process.env.HTTP_SERVER_PORT || 4343),
    skinportApiClientId: process.env.SKINPORT_API_CLIENT_ID,
    slinportApiClientSecret: process.env.SKINPORT_API_CLIENT_SECRET,
};
