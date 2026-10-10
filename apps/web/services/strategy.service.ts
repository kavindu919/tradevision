import api from "@/lib/api";
import type { StrategyInput } from "@/components/strategy/StrategyForm";

export const getStrategyVersions = (id: string) => {
  const res = api.get(`/strategies/${id}/versions`);
  return res;
};

export const createStrategy = (data: StrategyInput) => {
  return api.post("/strategies", data);
};
