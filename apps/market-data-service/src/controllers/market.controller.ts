import { Request, Response } from "express";
import { twelveDataClient } from "../config/twelvedata.js";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { symbol, interval, start, end } = req.query;

    const response = await twelveDataClient.get("/time_series", {
      params: {
        symbol,
        interval,
        start_date: start,
        end_date: end,
        format: "JSON",
      },
    });
    return res.status(200).json({
      success: true,
      data: response.data,
      message: "data retrived succesful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};
