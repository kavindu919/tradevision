import z from "zod";

export const twelvedataSchema = z.object({
  query: z.object({
    symbol: z
      .string({ message: "Symbol is required" })
      .min(1, "Symbol cannot be empty")
      .transform((val) => val.toUpperCase()),
    interval: z.enum(
      ["1min", "5min", "15min", "30min", "1h", "4h", "1day", "1week", "1month"],
      {
        message: "Invalid interval. Use 1min, 5min, 1h, 1day, etc.",
      },
    ),
    start: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD")
      .optional(),

    end: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be YYYY-MM-DD")
      .optional(),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});
