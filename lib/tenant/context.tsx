"use client";

import { createContext, useContext, ReactNode } from "react";

export interface TenantSettings {
  brandColor?: string;
  logo?: string;
  allowedChallenges?: string[];
  customChallenges?: boolean;
}

export interface TenantContextType {
  id: string;
  name: string;
  slug: string;
  settings: TenantSettings;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function useTenant() {
  return useContext(TenantContext);
}

interface TenantProviderProps {
  tenant: TenantContextType | null;
  children: ReactNode;
}

export function TenantProvider({ tenant, children }: TenantProviderProps) {
  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}
