"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type TGlobalMessage = {
  message: GlobalMessage;
  setMessage: Dispatch<SetStateAction<GlobalMessage>>;
};

export const GlobalMessageContext = createContext<TGlobalMessage | null>(null);

export default function GlobalMessageProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: GlobalMessage;
}) {
  const [message, setMessage] = useState(value);

  return (
    <GlobalMessageContext.Provider value={{ message, setMessage }}>
      {children}
    </GlobalMessageContext.Provider>
  );
}

export function useGlobalMessageContext() {
  const context = useContext(GlobalMessageContext);
  if (!context) {
    throw new Error(
      "useGlobalMessageContext must be within GlobalMessageProvider"
    );
  }

  return context;
}
