import { getList } from "@/services/list.service";
import { JsonResponse, ListResult } from "@/types/common.types";
import { ComboboxData, ComboboxItem, Select, SelectProps } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const CurrencySelector = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ ...props }, ref) => {
    const query = useQuery<JsonResponse<ListResult<Currency[]>>>({
      queryFn: async () => {
        return getList({
          model: "Currency",
          limit: "99999",
        });
      },
      queryKey: ["currencyList"],
      refetchOnReconnect: false,
      refetchOnMount: false,
    });
    const [data, setData] = React.useState<ComboboxData>();

    React.useEffect(() => {
      if (query.data) {
        const options: ComboboxItem[] = [];
        query.data.data.rows.map((row) => {
          options.push({
            value: String(row.id),
            label: row.currency,
          });
        });

        setData(options);
      }
    }, [query.data]);

    return <Select {...props} data={data} />;
  }
);

CurrencySelector.displayName = "CurrencySelector";
export default CurrencySelector;
