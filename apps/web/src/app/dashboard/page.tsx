'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.dashboard(),
  });

  if (isLoading) return <AppShell><p>Loading...</p></AppShell>;
  if (error) return <AppShell><p className="text-destructive">Error: {(error as Error).message}</p></AppShell>;

  const kpis = data?.kpis;

  return (
    <AppShell>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Operational overview of your business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Monthly revenue" value={formatCurrency(kpis?.monthRevenue ?? 0)} />
        <KpiCard title="Total margin" value={formatCurrency(kpis?.totalMargin ?? 0)} />
        <KpiCard title="Open orders" value={String(kpis?.openOrders ?? 0)} />
        <KpiCard title="Customers" value={String(kpis?.totalCustomers ?? 0)} />
        <KpiCard title="Low stock" value={String(kpis?.lowStockCount ?? 0)} />
      </div>

      {data?.lowStockAlerts && data.lowStockAlerts.length > 0 && (
        <Card className="mt-6 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800">Low stock alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.lowStockAlerts.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong>: {p.currentStock} {p.unit} (min {p.minStock})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Top customers by margin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data?.topCustomers?.length ? (
              data.topCustomers.map((c) => (
                <div key={c.name} className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(c.margin)} margin · {formatCurrency(c.revenue)} revenue
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data available yet.</p>
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
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
