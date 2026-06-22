import { Request, Response, NextFunction } from "express";

export const extractUserFromHeaders = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const userId = req.headers["x-user-id"];
  const userEmail = req.headers["x-user-email"];
  if (userId) {
    (req as any).user = {
      id: userId as string,
      email: userEmail as string,
    };
  }
  next();
};
