import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/env";

export interface JwtPayloadBase {
  userId: number;
  email: string;
}

const accessSecret: Secret = JWT_ACCESS_SECRET;

export function signAccessToken(
  payload: JwtPayloadBase,
  expiresIn: SignOptions["expiresIn"] = "15m"
) {
  return jwt.sign(payload, accessSecret, { expiresIn });
}

export function verifyAccessToken(token: string): JwtPayloadBase {
  return jwt.verify(token, accessSecret) as JwtPayloadBase;
}

