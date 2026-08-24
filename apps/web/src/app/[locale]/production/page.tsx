'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function ProductionPage() {
  const locale = useLocale();
  const t = useTranslations('production');
  const tc = useTranslations('common');
  const to = useTranslations('orders');
  const { data, isLoading } = useQuery({
    queryKey: ['production'],
    queryFn: () => api.production.list() as Promise<Array<{
      id: string;
      hours: number;
      materialCost: number;
      order: { id: string; reference: string; title: string; customer: { name: string } };
    }>>,
  });

  return (
    <AppShell>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">{t('recent')}</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{tc('loading')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">{to('order')}</th>
                    <th className="pb-2">{to('customer')}</th>
                    <th className="pb-2">{t('hours')}</th>
                    <th className="pb-2">{t('materials')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((e) => (
                    <tr key={e.id} className="border-b">
                      <td className="py-3">
                        <Link href={`/orders/${e.order.id}`} className="text-primary hover:underline">
                          {e.order.reference}
                        </Link>
                      </td>
                      <td className="py-3">{e.order.customer.name}</td>
                      <td className="py-3">{e.hours}h</td>
                      <td className="py-3">{formatCurrency(e.materialCost, locale)}</td>
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
