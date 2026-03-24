"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_service_1 = require("./auth.service");
const env_1 = require("../../config/env");
const httpError_1 = require("../../utils/httpError");
exports.authRouter = (0, express_1.Router)();
const cookieOptions = {
    httpOnly: true,
    secure: env_1.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
};
function requireValid(req) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        throw new httpError_1.HttpError(400, result.array()[0]?.msg ?? "Invalid request");
    }
}
exports.authRouter.post("/register", (0, express_validator_1.body)("email").isEmail().normalizeEmail(), (0, express_validator_1.body)("password").isString().isLength({ min: 6 }), (0, express_validator_1.body)("name").isString().isLength({ min: 2, max: 50 }).trim(), async (req, res, next) => {
    try {
        requireValid(req);
        const { email, password, name } = req.body;
        const result = await auth_service_1.authService.register(email, password, name);
        res.cookie("refreshToken", result.refreshToken, cookieOptions);
        return res.json({ accessToken: result.accessToken, user: result.user });
    }
    catch (err) {
        return next(err);
    }
});
exports.authRouter.post("/login", (0, express_validator_1.body)("email").isEmail().normalizeEmail(), (0, express_validator_1.body)("password").isString().isLength({ min: 6 }), async (req, res, next) => {
    try {
        requireValid(req);
        const { email, password } = req.body;
        const result = await auth_service_1.authService.login(email, password);
        res.cookie("refreshToken", result.refreshToken, cookieOptions);
        return res.json({ accessToken: result.accessToken, user: result.user });
    }
    catch (err) {
        return next(err);
    }
});
exports.authRouter.post("/refresh", async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            throw new httpError_1.HttpError(401, "Missing refresh token");
        }
        const result = await auth_service_1.authService.refresh(token);
        return res.json(result);
    }
    catch (err) {
        return next(err);
    }
});
exports.authRouter.post("/logout", async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            await auth_service_1.authService.logout(token);
        }
        res.clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 });
        return res.json({ message: "Logged out" });
    }
    catch (err) {
        return next(err);
    }
});
