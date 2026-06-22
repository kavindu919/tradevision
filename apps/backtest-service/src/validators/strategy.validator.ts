import z from "zod";

export const createStrategySchema = z.object({
  name: z
    .string({ message: "Name is required. Please enter a strategy name." })
    .min(1, { message: "Name is required. Please enter a strategy name." })
    .max(100, { message: "Name must be 100 characters or less." })
    .trim(),
  description: z
    .string({ message: "Description must be a piece of text." })
    .optional(),
  code: z
    .string({ message: "Code is required. Please enter the strategy code." })
    .min(1, { message: "Code is required. Please enter the strategy code." })
    .trim(),
  assetSymbol: z
    .string()
    .min(1, { message: "Asset symbol cannot be empty." })
    .max(20, { message: "Asset symbol cannot be longer than 20 characters." })
    .trim(),
  timeframe: z.enum(["1m", "5m", "15m", "1h", "4h", "1D", "1W"], {
    message: "Timeframe is required. Please select a valid timeframe option.",
  }),
  isPublic: z.boolean().default(false),
});

export const updateStrategySchema = createStrategySchema.partial().extend({
  id: z
    .string({ message: "Id is required. Please enter id" })
    .uuid({ message: "Invalid id format" }),
});
