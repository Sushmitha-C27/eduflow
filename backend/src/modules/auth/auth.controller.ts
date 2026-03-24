import { Router } from "express";
import { body, validationResult } from "express-validator";
import { authService } from "./auth.service";
import { NODE_ENV } from "../../config/env";
import { HttpError } from "../../utils/httpError";

export const authRouter = Router();

const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};

function requireValid(req: any) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new HttpError(400, result.array()[0]?.msg ?? "Invalid request");
  }
}

authRouter.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("name").isString().isLength({ min: 2, max: 50 }).trim(),
  async (req, res, next) => {
    try {
      requireValid(req);
      const { email, password, name } = req.body as {
        email: string;
        password: string;
        name: string;
      };

      const result = await authService.register(email, password, name);
      res.cookie("refreshToken", result.refreshToken, cookieOptions);
      return res.json({ accessToken: result.accessToken, user: result.user });
    } catch (err) {
      return next(err);
    }
  }
);

authRouter.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  async (req, res, next) => {
    try {
      requireValid(req);
      const { email, password } = req.body as { email: string; password: string };
      const result = await authService.login(email, password);
      res.cookie("refreshToken", result.refreshToken, cookieOptions);
      return res.json({ accessToken: result.accessToken, user: result.user });
    } catch (err) {
      return next(err);
    }
  }
);

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      throw new HttpError(401, "Missing refresh token");
    }
    const result = await authService.refresh(token);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (token) {
      await authService.logout(token);
    }
    res.clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 });
    return res.json({ message: "Logged out" });
  } catch (err) {
    return next(err);
  }
});

