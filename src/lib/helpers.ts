import {
  Authenticated,
  GlobalMessage,
  JsonResponse,
} from "@/types/common.types";
import {
  ColumnFiltersState,
  ColumnSort,
  PaginationState,
} from "@tanstack/react-table";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { useUserContext } from "./userProvider";

type TListQueryParams = {
  sorting: ColumnSort[];
  pagination: PaginationState;
  globalFilter: string;
  globalFilterColumns: string;
  columnFilters: ColumnFiltersState;
  withTrashed: boolean;
};

export const generateListQueryParams = (props: TListQueryParams) => {
  const params: any = new Object();
  if (props.sorting.length > 0) {
    props.sorting.map((sort) => {
      params.sort = sort.id;
      params.sort_direction = sort.desc ? "desc" : "asc";
    });
  }
  if (props.globalFilter !== "") {
    params.global_filter = props.globalFilter;
    params.global_filter_columns = props.globalFilterColumns;
  }
  params.with_trashed = props.withTrashed;
  params.page = (props.pagination.pageIndex + 1).toString();
  params.limit = props.pagination.pageSize.toString();
  if (props.columnFilters.length > 0) {
    params.filter = JSON.stringify(props.columnFilters);
  }

  return params;
};

export async function getMessageBag(
  locale: string,
  namespace: string
): Promise<GlobalMessage> {
  const t = await getTranslations({
    locale,
    namespace,
  });

  return {
    alert: {
      notification_message_bag: {
        critical_title: t("Notification.critical_title"),
        alert_title: t("Notification.alert_title"),
        info_title: t("Notification.info_title"),
      },
      saved: t("saved"),
    },
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + " bytes";
  } else if (bytes < 1024 * 1024) {
    const kilobytes = (bytes / 1024).toFixed(2);
    return parseFloat(kilobytes) + "KB";
  } else {
    const megabytes = (bytes / (1024 * 1024)).toFixed(2);
    return parseFloat(megabytes) + "MB";
  }
}

export function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export async function srcToFile(
  src: string,
  fileName: string,
  mimeType: string
) {
  return fetch(src)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], fileName, { type: mimeType });
    });
}

export async function updateUserData(
  setUserData: (value: React.SetStateAction<Authenticated | null>) => void,
  callback?: () => void
) {
  await fetch(`/api/auth/me`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<Authenticated>) => {
      setUserData(res.data);
      if (callback) {
        callback();
      }
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });
}

export function cleanData<T>(data: T) {
  for (let key in data) {
    if (data[key] === undefined) {
      delete data[key];
    }
  }

  return data;
}

export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
    : "0";
}

export function sumMultiDimensionalArray(array: any) {
  let total = 0;

  function sumArray(arr: number[]) {
    for (const item of arr) {
      if (Array.isArray(item)) {
        sumArray(item);
      } else {
        total += item;
      }
    }
  }

  sumArray(array);
  return total;
}
