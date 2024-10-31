"use client";

import { getStatistic } from "@/services/statistic.service";
import { JsonResponse } from "@/types/common.types";
import { useQuery } from "@tanstack/react-query";

export default function useProductsHeader() {
  const statisticQuery = useQuery<JsonResponse<{ [key: string]: number }[]>>({
    queryFn: async () => {
      return getStatistic({
        model: "Product",
        type: "total_all,total_active,total_inactive",
        all_outlet: "true",
      });
    },
    queryKey: ["productStatistic"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    statisticQuery,
  };
}
