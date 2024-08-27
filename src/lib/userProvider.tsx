"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type UserContextType = {
  userData: {
    user: User;
    privileges: string[] | null;
    subscriptions: Subscription[] | null;
    company: Company | null;
    outlet: Outlet | null;
    token_expired_at: string | null;
  } | null;
  setUserData: Dispatch<
    SetStateAction<{
      user: User;
      privileges: string[] | null;
      subscriptions: Subscription[] | null;
      company: Company | null;
      outlet: Outlet | null;
      token_expired_at: string | null;
    } | null>
  >;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: {
    user: User;
    privileges: string[] | null;
    subscriptions: Subscription[] | null;
    company: Company | null;
    outlet: Outlet | null;
    token_expired_at: string | null;
  } | null;
}) {
  const [userData, setUserData] = useState(value);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be within UserProvider");
  }

  return context;
}
