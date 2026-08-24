'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['margins'],
    queryFn: () => api.reports.margins() as Promise<Array<{
      reference: string;
      title: string;
      customer: string;
      status: string;
      margin: { revenue: number; totalCost: number; margin: number; marginPercent: number };
    }>>,
  });

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Margins per order</p>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/reports/margins/export/csv`}
          className="text-sm text-primary hover:underline"
          onClick={(e) => {
            const token = localStorage.getItem('opshub_access_token');
            const org = localStorage.getItem('opshub_org_id');
            if (token && org) {
              e.preventDefault();
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/margins/export/csv`, {
                headers: { Authorization: `Bearer ${token}`, 'x-organization-id': org },
              })
                .then((r) => r.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'margins.csv';
                  a.click();
                });
            }
          }}
        >
          Export CSV
        </a>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Margins by order</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Reference</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Revenue</th>
                  <th className="pb-2">Costs</th>
                  <th className="pb-2">Margin</th>
                  <th className="pb-2">%</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((r) => (
                  <tr key={r.reference} className="border-b">
                    <td className="py-3 font-medium">{r.reference}</td>
                    <td className="py-3">{r.customer}</td>
                    <td className="py-3">{formatCurrency(r.margin.revenue)}</td>
                    <td className="py-3">{formatCurrency(r.margin.totalCost)}</td>
                    <td className="py-3">{formatCurrency(r.margin.margin)}</td>
                    <td className="py-3">{r.margin.marginPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
