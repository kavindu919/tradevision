import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.FRONTEND_URL ?? "http://localhost:3007"}/verify-email?token=${token}`;
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "testjayakody@gmail.com",
      subject: "Verify your TradeVision account",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to TradeVision!</h2>
        <p>Please verify your email address to get started.</p>
        <a href="${verificationLink}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't create an account, ignore this email.</p>
      </div>
    `,
    });
  } catch (error) {
    throw error;
  }
};
