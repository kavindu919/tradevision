import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = schema.parse(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstErrorMessage = error.issues[0].message;
        return res.status(400).json({
          success: false,
          message: firstErrorMessage,
        });
      }
      next(error);
    }
  };
