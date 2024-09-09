"use client";

import { Avatar, Box, BoxProps } from "@mantine/core";
import { IconBuildings, IconMapPin } from "@tabler/icons-react";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { useLocale, useTranslations } from "next-intl";

dayjs.extend(relativeTime);

type TUserCard = {
  user: User | undefined;
  company: Company | undefined;
  outlet: Outlet | undefined;
  token_expired_at: string | undefined;
};

const UserCard = React.forwardRef<HTMLDivElement, TUserCard & BoxProps>(
  ({ user, company, outlet, token_expired_at, ...props }, ref) => {
    const locale = useLocale();
    const t = useTranslations("Dashboard");

    return (
      <Box {...props} ref={ref}>
        <div className="flex gap-5 p-4">
          <Avatar size="xl" src={user?.avatar_url} alt={user?.display_name} />
          <div>
            <p className="m-0 text-lg">{user?.display_name}</p>
            <p className="m-0 leading-none text-sm font-semibold">
              {user?.group.name}
            </p>
            <div className="flex gap-2 mt-4">
              <i className="ti ti-mail text-sm"></i>
              <p className="m-0 text-sm font-light leading-none">
                {user?.email}
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              <i className="ti ti-phone text-sm"></i>
              <p className="m-0 text-sm font-light leading-none">
                {user?.phone_number
                  ? `${user.phone_code} ${user.phone_number}`
                  : "-"}
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <IconBuildings size={13} />
              <p className="m-0 text-sm font-light leading-none">
                {company?.name}
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              <IconMapPin size={13} />
              <p className="m-0 text-sm font-light leading-none">
                {outlet?.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-4 opacity-75">
          <p className="m-0 text-sm italic font-light leading-none">
            {t("UserCard.last_login")}{" "}
            <span className="font-semibold">
              {user?.last_login
                ? dayjs(user.last_login).locale(locale).fromNow()
                : "-"}
            </span>
          </p>
        </div>
      </Box>
    );
  }
);

UserCard.displayName = "UserCard";

export default UserCard;
