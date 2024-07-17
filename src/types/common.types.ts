type JsonResponse<T> = {
  status: boolean;
  data: T;
  message: string;
  trace: string;
  statusCode: number;
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
  links?: { label: string; link: string }[];
};
