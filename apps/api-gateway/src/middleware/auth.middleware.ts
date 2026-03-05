import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Access denided" });
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }
    const decode = verifyAccessToken(token);
    const user = {
      user_id: decode.sub,
      email: decode.email,
    };
    (req as any).user = user;
    req.headers["x-user-id"] = decode.sub;
    req.headers["x-user-email"] = decode.email;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }
    const decode = verifyAccessToken(token);
    const user = {
      user_id: decode.sub,
      email: decode.email,
    };
    (req as any).user = user;
    req.headers["x-user-id"] = decode.sub;
    req.headers["x-user-email"] = decode.email;
    next();
  } catch (error) {}
};
