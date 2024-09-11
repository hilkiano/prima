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
