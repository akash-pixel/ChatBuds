import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: +process.env.PORT!,
    HOST: process.env.HOST!,
    CORS_OPTIONS: {
        origin: process.env.CORS_ORIGIN
    },
    CLIENT_URL: process.env.CLIENT_URL!
}; 