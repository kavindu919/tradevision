import z from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address.")
      .regex(/^\S+$/, "Email must not contain spaces."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/^\S+$/, "Password must not contain spaces."),

    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name must be less than 100 characters.")
      .regex(/^\S(.*\S)?$/, "Full name must not start or end with spaces."),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address.")
      .min(1, "Email is required."),

    password: z.string().min(1, "Password is required."),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Verification token is required."),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
