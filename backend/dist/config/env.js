"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGIN = exports.JWT_REFRESH_SECRET = exports.JWT_ACCESS_SECRET = exports.DATABASE_URL = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.NODE_ENV = process.env.NODE_ENV ?? "development";
exports.PORT = Number(process.env.PORT ?? 4000);
exports.DATABASE_URL = process.env.DATABASE_URL ?? "";
exports.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";
exports.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
