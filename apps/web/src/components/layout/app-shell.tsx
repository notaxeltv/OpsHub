'use client';

import { useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Factory,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { PreferencesBar } from '@/components/preferences-bar';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { href: '/customers', key: 'customers', icon: Users },
  { href: '/orders', key: 'orders', icon: ClipboardList },
  { href: '/production', key: 'production', icon: Factory },
  { href: '/inventory', key: 'inventory', icon: Package },
  { href: '/reports', key: 'reports', icon: BarChart3 },
  { href: '/settings', key: 'settings', icon: Settings },
] as const;

function NavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useTranslations('nav');
  const tc = useTranslations('common');

  return (
    <nav className={cn('space-y-1', className)}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{tc('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between gap-2 border-b px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={tc('menu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="shrink-0 font-bold text-primary">OpsHub</span>
          <div className="hidden sm:block">
            <OrganizationSwitcher />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <PreferencesBar compact />
          </div>
          {user && (
            <span className="hidden max-w-[120px] truncate text-sm text-muted-foreground sm:inline md:max-w-none">
              {user.firstName} {user.lastName}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-2"
            onClick={() => { logout(); router.push('/login'); }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-muted/30 p-4 lg:block">
          <NavLinks pathname={pathname} />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r bg-background p-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-primary">OpsHub</span>
                <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)} aria-label={tc('close')}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <OrganizationSwitcher />
              <div className="my-4">
                <PreferencesBar compact />
              </div>
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} className="flex-1" />
            </aside>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
