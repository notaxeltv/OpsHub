'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { api, clearAuthSession, getStoredOrgId, setOrganizationId, Organization } from '@/lib/api';

const PUBLIC_SUFFIXES = ['', '/', '/login', '/register'];

function isPublicPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const withoutLocale =
    segments[0] && routing.locales.includes(segments[0] as (typeof routing.locales)[number])
      ? '/' + segments.slice(1).join('/')
      : pathname;
  const normalized = withoutLocale === '' ? '/' : withoutLocale;
  return PUBLIC_SUFFIXES.some(
    (p) => normalized === p || (p !== '' && normalized.startsWith(`${p}/`)),
  );
}

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
      if (!isPublicPath(pathname)) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

  useEffect(() => {
    if (isPublicPath(pathname)) {
      setLoading(false);
      return;
    }
    setLoading(true);
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
