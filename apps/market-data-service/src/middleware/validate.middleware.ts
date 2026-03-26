import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const error = result.error.issues[0].message;
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    (req as any).validated = result.data;

    next();
  };
