import { getList } from "@/services/list.service";
import { JsonResponse, ListResult } from "@/types/common.types";
import {
  Combobox,
  Group,
  InputBase,
  useCombobox,
  Text,
  Input,
  ScrollArea,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";

type Item = {
  code: string;
  value: string;
  label: string;
  country: string;
  emoji: string;
};

type TPhoneCodeSelector = {
  errorString?: string | undefined;
  onChange: any;
  fieldValue: string;
};

const PhoneCodeSelector = React.forwardRef<
  HTMLButtonElement,
  TPhoneCodeSelector
>(({ errorString, onChange, fieldValue }, ref) => {
  const t = useTranslations("Form");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });
  const [value, setValue] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [phoneCodeOptions, setPhoneCodeOptions] = React.useState<Item[]>([]);
  const query = useQuery<JsonResponse<ListResult<PhoneCode[]>>>({
    queryFn: async () => {
      return getList({
        model: "PhoneCode",
        limit: "99999",
      });
    },
    queryKey: ["phoneCodeList"],
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  const selectedOption = phoneCodeOptions.find((item) => item.value === value);

  React.useEffect(() => {
    if (fieldValue) {
      setValue(fieldValue);
    }
  }, [fieldValue]);

  const options = phoneCodeOptions
    .filter((item) =>
      item.country.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((opt, idx) => {
      return (
        <Combobox.Option value={opt.value} key={idx}>
          <Group>
            <span role="img">{opt.emoji}</span>
            <div>
              <Text fz="sm" fw={500}>
                {opt.label}
              </Text>
              <Text fz="xs" opacity={0.6}>
                {opt.country}
              </Text>
            </div>
          </Group>
        </Combobox.Option>
      );
    });

  React.useEffect(() => {
    if (query.data) {
      const options: Item[] = [];
      query.data.data.rows.map((row) => {
        options.push({
          value: row.dial_code,
          label: row.dial_code,
          code: row.code,
          country: row.country,
          emoji: row.emoji,
        });
      });

      setPhoneCodeOptions(options);
    }
  }, [query.data]);

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      position="bottom-start"
      onOptionSubmit={(val) => {
        onChange ? onChange(val) : null;
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          variant="filled"
          className="flex-shrink-0"
          error={errorString}
          value={fieldValue}
        >
          {selectedOption ? (
            <Group>
              <span role="img">{selectedOption.emoji}</span>
              <Text fz="sm" fw={500}>
                {selectedOption.label}
              </Text>
            </Group>
          ) : (
            <Input.Placeholder>{t("phone_code_label")}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown className="!w-[320px]">
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={t("phone_code_search_placeholder")}
        />
        <Combobox.Options>
          {options.length > 0 ? (
            <ScrollArea.Autosize mah={200}>{options}</ScrollArea.Autosize>
          ) : (
            <Combobox.Empty>{t("phone_code_nothing_found")}</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});

PhoneCodeSelector.displayName = "PhoneCodeSelector";
export default PhoneCodeSelector;
