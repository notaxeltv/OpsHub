'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.dashboard(),
  });

  if (isLoading) return <AppShell><p>{tc('loading')}</p></AppShell>;
  if (error) return <AppShell><p className="text-destructive">{tc('error')}: {(error as Error).message}</p></AppShell>;

  const kpis = data?.kpis;

  return (
    <AppShell>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard title={t('monthlyRevenue')} value={formatCurrency(kpis?.monthRevenue ?? 0, locale)} />
        <KpiCard title={t('totalMargin')} value={formatCurrency(kpis?.totalMargin ?? 0, locale)} />
        <KpiCard title={t('openOrders')} value={String(kpis?.openOrders ?? 0)} />
        <KpiCard title={t('customers')} value={String(kpis?.totalCustomers ?? 0)} />
        <KpiCard title={t('lowStock')} value={String(kpis?.lowStockCount ?? 0)} />
      </div>

      {data?.lowStockAlerts && data.lowStockAlerts.length > 0 && (
        <Card className="mt-6 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800 dark:text-amber-200">{t('lowStockAlerts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.lowStockAlerts.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong>: {p.currentStock} {p.unit} ({t('min')} {p.minStock})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 md:mt-8">
        <CardHeader>
          <CardTitle className="text-lg">{t('topCustomers')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data?.topCustomers?.length ? (
              data.topCustomers.map((c) => (
                <div key={c.name} className="flex flex-col gap-1 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {t('marginRevenue', {
                      margin: formatCurrency(c.margin, locale),
                      revenue: formatCurrency(c.revenue, locale),
                    })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('noData')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <CardTitle className="text-xl sm:text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
