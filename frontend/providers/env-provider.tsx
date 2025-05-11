import { createContext, useContext, ReactNode } from "react";

type FrontendEnvContextType = {
  BACKEND_URL: string;
};

const FrontendEnvContext = createContext<FrontendEnvContextType | null>(null);

type FrontendEnvProviderProps = {
  children: ReactNode;
  env: FrontendEnvProviderProps["children"] extends never ? never : FrontendEnvContextType;
};

export function FrontendEnvProvider({ children, env }: FrontendEnvProviderProps) {
  return <FrontendEnvContext.Provider value={env}>{children}</FrontendEnvContext.Provider>;
}

export function useFrontendEnv() {
  const context = useContext(FrontendEnvContext);
  if (!context) {
    throw new Error("useFrontendEnv must be used within an FrontendEnvProvider");
  }
  return context;
} 