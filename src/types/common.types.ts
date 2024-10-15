import { UseQueryResult } from "@tanstack/react-query";
import {
  ColumnSort,
  PaginationState,
  ColumnFiltersState,
} from "@tanstack/react-table";

export type JsonResponse<T> = {
  status: boolean;
  data: T;
  message: string;
  trace: string;
  code: number;
  i18n: GlobalMessage;
};

export type Authenticated = {
  user: User;
  privileges: string[];
  subscriptions: Subscription[];
  company: Company;
  outlet: Outlet;
  refreshed_token?: string;
  token_expired_at: string;
  geolocation: IPGeolocation;
};

export type Onboarding = {
  personal_info?: PersonalInfo;
  company_info?: CompanyInfo;
  tnc?: boolean;
};

export type PersonalInfo = {
  given_name: string;
  family_name: string;
  gender: string;
  email: string;
  phone_code?: string;
  phone_number: string;
  address: string;
};

export type CompanyInfo = {
  name: string;
  email: string;
  phone_code?: string;
  phone_number: string;
  address: string;
};

export type GlobalMessage = {
  alert: AlertMessage;
};

export type AlertMessage = {
  notification_message_bag: NotificationMessage;
  saved: string;
};

export type NotificationMessage = {
  critical_title: string;
  alert_title: string;
  info_title: string;
};

export type NavbarLinks = {
  icon: string;
  label: string;
  activeScope?: string[];
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    link: string;
    privilege?: string;
    activeScope?: string[];
  }[];
  privilege?: string;
  onClick?: () => void;
};

export type ListResult<T> = {
  total: number;
  prev_page: string;
  next_page: string;
  rows: T;
  page_count: number;
  page: number;
};

export type DataTableState = {
  query: any;
  sorting: ColumnSort[];
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort[]>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setGlobalFilterColumns: React.Dispatch<React.SetStateAction<string>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  withTrashed: boolean;
  setWithTrashed: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ImportEventProgress = {
  file: string;
  message: string;
  progress: number;
  details: {
    data:
      | { [key: string]: number[] }[]
      | { errors: string[]; product_name: string }[];
    message: string;
  };
  is_done: boolean;
  is_error: boolean;
};
