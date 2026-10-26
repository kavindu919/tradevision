import api from "@/lib/api";

export type StrategyInput = {
  name: string;
  description: string;
  code: string;
  asset_symbol: string;
  timeframe: string;
};

export const getStrategyVersions = (id: string) => {
  const res = api.get(`/strategies/${id}/versions`);
  return res;
};

export const createStrategy = (data: StrategyInput) => {
  return api.post("/strategies", data);
};

export const getStrategies = async () => {
  const res = await api.get("/strategies");
  console.log("res", res.data);
  return res;
};
