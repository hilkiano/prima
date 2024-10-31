import { JsonResponse, ListResult } from "@/types/common.types";
import { TextInput, TextInputProps } from "@mantine/core";
import { UseQueryResult } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

type TSearchBar = {
  dataQuery: UseQueryResult<JsonResponse<ListResult<any>>, Error>;
  table: Table<any>;
  onSearch: () => void;
};

interface SearchBarRef {
  getValue: () => string | undefined;
}

const SearchBar = forwardRef<SearchBarRef, TextInputProps & TSearchBar>(
  ({ dataQuery, table, onSearch, ...props }, ref) => {
    const t = useTranslations("Data");
    const inputRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();

    useImperativeHandle(ref, () => ({
      getValue: () => inputRef.current?.value,
    }));

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onSearch();
      }
    };

    useEffect(() => {
      if (searchParams.get("filter") !== null) {
        inputRef.current?.setAttribute("value", searchParams.get("filter")!);
      }
    }, [searchParams]);

    return (
      <TextInput
        variant="default"
        ref={inputRef}
        radius="xl"
        size="md"
        placeholder={t("search")}
        disabled={dataQuery.isLoading}
        onKeyUp={handleKeyPress}
        {...props}
      />
    );
  }
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
