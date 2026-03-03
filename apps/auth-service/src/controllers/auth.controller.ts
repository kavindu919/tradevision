import { Request, Response, NextFunction, response } from "express";
import prisma from "../../../../packages/db-client/src";
import { comparePassword, hashPassword } from "../utils/password.util";
import {
  emailverificationToken,
  hashToken,
  refreshTokenExpiry,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body;
    const isUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (isUser) {
      return res.status(409).json({
        success: false,
        message: "User already exsist",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        full_name: fullname,
        email: email,
        password_hash: hashedPassword,
      },
    });

    const verificationTokenforEmail = emailverificationToken();
    const verificationTokenforEmailExpire = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );
    await prisma.emailVerification.create({
      data: {
        token: verificationTokenforEmail,
        user_id: user.id,
        expires_at: verificationTokenforEmailExpire,
      },
    });

    const access_token = signAccessToken(user.id, user.email);
    const refresh_token = signRefreshToken(user.id, user.email);
    const hashed_refresh_token = hashToken(refresh_token);
    const refresh_token_expire = refreshTokenExpiry();

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token_hash: hashed_refresh_token,
        expires_at: refresh_token_expire,
      },
    });
    const userData = {
      fullname: user.full_name,
      email: user.email,
      is_verified: user.is_verified,
    };
    return res.status(201).json({
      success: true,
      data: userData,
      tokens: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
      message: "Registration complte",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wong please try again",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!isUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (!isUser.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isPassword = await comparePassword(password, isUser.password_hash);
    if (!isPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const access_token = signAccessToken(isUser.id, isUser.email);
    const refresh_token = signRefreshToken(isUser.id, isUser.email);
    const hashed_refresh_token = hashToken(refresh_token);
    const refresh_token_expire = refreshTokenExpiry();

    await prisma.refreshToken.create({
      data: {
        user_id: isUser.id,
        token_hash: hashed_refresh_token,
        expires_at: refresh_token_expire,
      },
    });

    const userData = {
      fullname: isUser.full_name,
      email: isUser.email,
      is_verified: isUser.is_verified,
    };
    return res.status(201).json({
      success: true,
      data: userData,
      tokens: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wong please try again",
    });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Missing required field",
      });
    }

    let payload: { sub: string; email: string };
    try {
      payload = verifyRefreshToken(token) as { sub: string; email: string };
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const hashedToken = hashToken(token);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token_hash: hashedToken },
    });

    if (!storedToken) {
      await prisma.refreshToken.deleteMany({
        where: { user_id: payload.sub },
      });
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (storedToken.expires_at < new Date()) {
      await prisma.refreshToken.delete({
        where: { token_hash: hashedToken },
      });
      return res.status(401).json({
        success: false,
        message: "Refresh token expired, please login again",
      });
    }

    await prisma.refreshToken.delete({
      where: { token_hash: hashedToken },
    });

    const access_token = signAccessToken(storedToken.user_id, payload.email);
    const refresh_token = signRefreshToken(storedToken.user_id, payload.email);

    await prisma.refreshToken.create({
      data: {
        user_id: storedToken.user_id,
        token_hash: hashToken(refresh_token),
        expires_at: refreshTokenExpiry(),
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: storedToken.user_id },
    });

    return res.status(200).json({
      success: true,
      data: {
        fullname: user!.full_name,
        email: user!.email,
        is_verified: user!.is_verified,
      },
      tokens: {
        access_token,
        refresh_token,
      },
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }
    const hashedToken = hashToken(token);
    await prisma.refreshToken.deleteMany({
      where: { token_hash: hashedToken },
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Missing required feild",
      });
    }
    const verifyToken = await prisma.emailVerification.findUnique({
      where: { token: token },
    });
    if (!verifyToken || verifyToken.expires_at < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Access denied",
      });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: verifyToken.user_id,
        },
        data: {
          is_verified: true,
        },
      }),
      prisma.emailVerification.delete({
        where: { token: token },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Email verication successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

export const upsertOAuthUser = async (req: Request, res: Response) => {
  try {
    const { email, provider, provider_id, name } = req.body;

    if (!email || !provider || !provider_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required field",
      });
    }

    const auth_user = await prisma.authAccount.findUnique({
      where: {
        provider_provider_id: {
          provider: provider,
          provider_id: provider_id,
        },
      },
    });

    if (auth_user) {
      const user = await prisma.user.findUnique({
        where: { id: auth_user.user_id },
      });

      if (!user) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong please try again",
        });
      }

      const access_token = signAccessToken(user.id, user.email);
      const refresh_token = signRefreshToken(user.id, user.email);

      await prisma.refreshToken.create({
        data: {
          user_id: user.id,
          token_hash: hashToken(refresh_token),
          expires_at: refreshTokenExpiry(),
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          fullname: user.full_name,
          email: user.email,
          is_verified: user.is_verified,
        },
        tokens: {
          access_token: access_token,
          refresh_token: refresh_token,
        },
        message: "Login successful",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      const access_token = signAccessToken(existingUser.id, existingUser.email);
      const refresh_token = signRefreshToken(
        existingUser.id,
        existingUser.email,
      );

      await prisma.$transaction([
        prisma.refreshToken.create({
          data: {
            user_id: existingUser.id,
            token_hash: hashToken(refresh_token),
            expires_at: refreshTokenExpiry(),
          },
        }),
        prisma.authAccount.create({
          data: {
            provider: provider,
            provider_id: provider_id,
            user_id: existingUser.id,
          },
        }),
        prisma.user.update({
          where: { id: existingUser.id },
          data: { is_verified: true },
        }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          fullname: existingUser.full_name,
          email: existingUser.email,
          is_verified: true,
        },
        tokens: {
          access_token: access_token,
          refresh_token: refresh_token,
        },
        message: "Login successful",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        full_name: name,
        email: email,
        password_hash: null,
        is_verified: true,
      },
    });

    const access_token = signAccessToken(newUser.id, newUser.email);
    const refresh_token = signRefreshToken(newUser.id, newUser.email);

    await prisma.$transaction([
      prisma.refreshToken.create({
        data: {
          user_id: newUser.id,
          token_hash: hashToken(refresh_token),
          expires_at: refreshTokenExpiry(),
        },
      }),
      prisma.authAccount.create({
        data: {
          provider: provider,
          provider_id: provider_id,
          user_id: newUser.id,
        },
      }),
    ]);

    return res.status(201).json({
      success: true,
      data: {
        fullname: newUser.full_name,
        email: newUser.email,
        is_verified: newUser.is_verified,
      },
      tokens: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const profile = (req as any).user as {
      provider: string;
      provider_id: string;
      email: string;
      name: string;
      avatar_url: string | null;
    };

    if (!profile) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed",
      });
    }

    req.body = profile;
    return upsertOAuthUser(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};
