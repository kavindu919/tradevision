import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../../../../packages/db-client/src";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"));

        done(null, {
          provider: "google",
          provider_id: profile.id,
          email: email,
          name: profile.displayName,
          avatar_url: profile.photos?.[0]?.value,
        });
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

export default passport;
