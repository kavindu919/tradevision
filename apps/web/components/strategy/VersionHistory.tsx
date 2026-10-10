"use client";

import { toast } from "@/components/ui/toast";
import { getStrategyVersions } from "@/services/strategy.service";
import { useEffect, useState } from "react";

interface Version {
  id: string;
  version: string;
  name: string;
  createdAt: string;
}

interface VersionHistoryProps {
  strategyId: string;
}

export const VersionHistory = ({ strategyId }: VersionHistoryProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Version[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getStrategyVersions(strategyId);
      if (res.data.success == true) {
        setData(res.data.data);
      }
    } catch (error: any) {
      toast.add({
        type: "warning",
        description: error ?? "Something went wrong. Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
};
