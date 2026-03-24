import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const PORT = Number(process.env.PORT ?? 4000);

export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

