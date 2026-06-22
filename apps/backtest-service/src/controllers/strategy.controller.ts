import { Request, Response } from "express";
import { prisma } from "@tradevision/db-client";

export const listStrategies = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(404).json({
        success: false,
        message: "Unauthorized. Missing or invalid user session.",
      });

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const [strategies, total] = await Promise.all([
      prisma.strategy.findMany({
        where: { user_id: userId, status: { not: "archived" } },
        select: {
          id: true,
          name: true,
          description: true,
          code: true,
          asset_symbol: true,
          timeframe: true,
          is_public: true,
          status: true,
          version: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.strategy.count({
        where: {
          user_id: userId,
          status: { not: "archived" },
        },
      }),
    ]);
    return res.status(200).json({
      success: true,
      data: { strategies, total, page, limit },
      message: "Successfully retrieved strategies",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export const createStrategy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(404).json({
        success: false,
        message: "Unauthorized. Missing or invalid user session.",
      });
    const { name, description, code, assetSymbol, timeframe, isPublic } =
      req.body;
    await prisma.strategy.create({
      data: {
        name: name,
        description: description,
        code: code,
        asset_symbol: assetSymbol,
        timeframe: timeframe,
        is_public: isPublic,
        user_id: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Strategy created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export const getStrategy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(404).json({
        success: false,
        message: "Unauthorized. Missing or invalid user session.",
      });
    const strategy = await prisma.strategy.findFirst({
      where: {
        user_id: userId,
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        asset_symbol: true,
        timeframe: true,
        is_public: true,
        status: true,
        version: true,
      },
    });
    if (!strategy)
      return res.status(404).json({
        success: false,
        message: "Strategy not found.",
      });
    return res.status(200).json({
      success: true,
      data: { strategy },
      message: "Successfully retrieved strategy",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export const updateStrategy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(404).json({
        success: false,
        message: "Unauthorized. Missing or invalid user session.",
      });
    const { name, description, code, assetSymbol, timeframe, isPublic } =
      req.body;

    const strategy = await prisma.strategy.findFirst({
      where: {
        user_id: userId,
        id: req.params.id,
      },
    });
    if (!strategy)
      return res.status(404).json({
        success: false,
        message: "Strategy not found.",
      });
    await prisma.strategy.update({
      where: {
        user_id: userId,
        id: req.params.id,
      },
      data: {
        name: name,
        description: description,
        code: code,
        asset_symbol: assetSymbol,
        timeframe: timeframe,
        is_public: isPublic,
      },
    });
    await prisma.strategyVersion.create({
      data: {
        strategyId: strategy.id,
        version: strategy.version,
        code: strategy.code,
        description: strategy.description,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Strategy updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export const archiveStrategy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(404).json({
        success: false,
        message: "Unauthorized. Missing or invalid user session.",
      });
    const strategy = await prisma.strategy.findFirst({
      where: {
        user_id: userId,
        id: req.params.id,
      },
    });
    if (!strategy)
      return res.status(404).json({
        success: false,
        message: "Strategy not found.",
      });

    await prisma.strategy.update({
      where: {
        user_id: userId,
        id: req.params.id,
      },
      data: { status: "archived" },
    });
    return res.status(200).json({
      success: true,
      message: "Strategy status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export const cloneStrategy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(404).json({
        success: false,
        message: "Unauthorized. Missing or invalid user session.",
      });
    const strategy = await prisma.strategy.findFirst({
      where: {
        user_id: userId,
        id: req.params.id,
      },
    });
    if (!strategy)
      return res.status(404).json({
        success: false,
        message: "Strategy not found.",
      });

    await prisma.strategy.create({
      data: {
        name: `${strategy.name} (Copy)`,
        description: strategy.description,
        code: strategy.code,
        asset_symbol: strategy.asset_symbol,
        timeframe: strategy.timeframe,
        user_id: userId,
        is_public: false,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Strategy cloned successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export const listPublicStrategies = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const [strategies, total] = await Promise.all([
      prisma.strategy.findMany({
        where: {
          is_public: true,
          status: "active",
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { full_name: true, avatar_url: true } } },
      }),
      prisma.strategy.count({ where: { isPublic: true, status: "active" } }),
    ]);
    return res.status(200).json({
      success: true,
      data: { strategies, total, page, limit },
      message: "Successfully retrieved strategies",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};
