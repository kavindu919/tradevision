import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export function verifyAccessToken(token: string) {
  if (!ACCESS_SECRET) {
    throw new Error("ACCESS_SECRET not defined");
  }
  return jwt.verify(token, ACCESS_SECRET) as { sub: string; email: string };
}
