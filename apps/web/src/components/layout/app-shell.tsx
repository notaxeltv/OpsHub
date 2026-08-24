'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Factory,
  Package,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { Button } from '@/components/ui/button';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Clienti', icon: Users },
  { href: '/orders', label: 'Commesse', icon: ClipboardList },
  { href: '/production', label: 'Produzione', icon: Factory },
  { href: '/inventory', label: 'Magazzino', icon: Package },
  { href: '/reports', label: 'Report', icon: BarChart3 },
  { href: '/settings', label: 'Impostazioni', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <span className="font-bold text-primary">OpsHub</span>
          <OrganizationSwitcher />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {user && <span>{user.firstName} {user.lastName}</span>}
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => { logout(); router.push('/login'); }}>
            <LogOut className="h-4 w-4" /> Esci
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/30 p-4">
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
