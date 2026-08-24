'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function ReportsPage() {
  const locale = useLocale();
  const t = useTranslations('reports');
  const tc = useTranslations('common');
  const to = useTranslations('orders');
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
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
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
          {t('exportCsv')}
        </a>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">{t('marginsByOrder')}</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{tc('loading')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">{to('reference')}</th>
                    <th className="pb-2">{to('customer')}</th>
                    <th className="pb-2">{to('revenue')}</th>
                    <th className="pb-2">{t('costs')}</th>
                    <th className="pb-2">{to('margin')}</th>
                    <th className="pb-2">{t('percent')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((r) => (
                    <tr key={r.reference} className="border-b">
                      <td className="py-3 font-medium">{r.reference}</td>
                      <td className="py-3">{r.customer}</td>
                      <td className="py-3">{formatCurrency(r.margin.revenue, locale)}</td>
                      <td className="py-3">{formatCurrency(r.margin.totalCost, locale)}</td>
                      <td className="py-3">{formatCurrency(r.margin.margin, locale)}</td>
                      <td className="py-3">{r.margin.marginPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
