import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this resource",
      });
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
    console.log(error);
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
    const token = req.cookies.accessToken;
    if (!token) return next();
    const decode = verifyAccessToken(token);
    req.headers["x-user-id"] = decode.sub;
    req.headers["x-user-email"] = decode.email;
    next();
  } catch (error) {
    next();
  }
};
