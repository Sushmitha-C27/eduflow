"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookiesMiddleware = void 0;
exports.requireAuth = requireAuth;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jwt_1 = require("../utils/jwt");
exports.cookiesMiddleware = (0, cookie_parser_1.default)();
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.userId, email: payload.email };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
