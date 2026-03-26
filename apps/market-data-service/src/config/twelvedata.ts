import axios from "axios";

const BASE_URL = process.env.TD_BASE_URL;

export const twelveDataClient = axios.create({
  baseURL: BASE_URL!,
  params: {
    apikey: process.env.TD_API_KEY,
  },
});
