import { config } from 'dotenv';

config();

export const PORT = Number(process.env.PORT);
export const DB_PATH = process.env.DB_PATH;
