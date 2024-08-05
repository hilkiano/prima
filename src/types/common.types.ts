type JsonResponse<T> = {
  status: boolean;
  data: T;
  message: string;
  trace: string;
  code: number;
};

type Authenticated = {
  user: User;
  privileges: string[];
  subscriptions: Subscription[];
  refreshed_token?: string;
  token_expired_at: string;
};

type Onboarding = {
  personal_info?: PersonalInfo;
  company_info?: CompanyInfo;
  tnc?: boolean;
};

type PersonalInfo = {
  given_name: string;
  family_name: string;
  gender: string;
  email: string;
  phone_number: string;
  address: string;
};

type CompanyInfo = {
  name: string;
  email: string;
  phone_number: string;
  address: string;
};

type GlobalMessage = {
  alert: AlertMessage;
};

type AlertMessage = {
  notification_message_bag: NotificationMessage;
};

type NotificationMessage = {
  critical_title: string;
  alert_title: string;
  info_title: string;
};

type NavbarLinks = {
  icon: string;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string; privilege?: string }[];
  privilege?: string;
};
