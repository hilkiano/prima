import {
  ColumnFiltersState,
  ColumnSort,
  PaginationState,
} from "@tanstack/react-table";

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
