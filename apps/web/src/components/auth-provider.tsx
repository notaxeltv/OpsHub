'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api, clearAuthSession, getStoredOrgId, setOrganizationId, Organization } from '@/lib/api';

const PUBLIC_PATHS = ['/login', '/register'];

interface AuthState {
  user: { firstName: string; lastName: string; email: string } | null;
  organizations: Organization[];
  currentOrgId: string | null;
  loading: boolean;
  switchOrganization: (orgId: string) => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthState['user']>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.me();
      setUser(data.user);
      setOrganizations(data.organizations);
      const stored = getStoredOrgId();
      const orgId = stored && data.organizations.some((o) => o.id === stored)
        ? stored
        : data.organizations[0]?.id ?? null;
      if (orgId) {
        setOrganizationId(orgId);
        setCurrentOrgId(orgId);
      }
    } catch {
      clearAuthSession();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh, pathname]);

  const switchOrganization = (orgId: string) => {
    setOrganizationId(orgId);
    setCurrentOrgId(orgId);
    router.refresh();
  };

  const logout = () => {
    clearAuthSession();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, organizations, currentOrgId, loading, switchOrganization, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
