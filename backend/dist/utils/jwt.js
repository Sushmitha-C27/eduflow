"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const accessSecret = env_1.JWT_ACCESS_SECRET;
function signAccessToken(payload, expiresIn = "15m") {
    return jsonwebtoken_1.default.sign(payload, accessSecret, { expiresIn });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, accessSecret);
}
