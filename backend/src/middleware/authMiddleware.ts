import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthedRequest extends Request {
  user?: { id: number; email: string };
}

export const cookiesMiddleware = cookieParser();

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

