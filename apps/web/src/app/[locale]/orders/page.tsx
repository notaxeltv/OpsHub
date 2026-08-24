'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';

const STATUSES = ['', 'DRAFT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'INVOICED'] as const;

export default function OrdersPage() {
  const t = useTranslations('orders');
  const tc = useTranslations('common');
  const ts = useTranslations('status');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, search, status],
    queryFn: () => api.orders.list({
      page,
      limit: 10,
      search: search || undefined,
      status: status || undefined,
    }),
  });

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button asChild><Link href="/orders/new">{t('new')}</Link></Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">{t('list')}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder={tc('search')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full sm:w-40"
            />
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s ? ts(s) : ts('all')}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{tc('loading')}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">{t('reference')}</th>
                      <th className="pb-2">{t('orderTitle')}</th>
                      <th className="pb-2">{t('customer')}</th>
                      <th className="pb-2">{t('status')}</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((o) => (
                      <tr key={o.id} className="border-b">
                        <td className="py-3 font-medium">{o.reference}</td>
                        <td className="py-3">{o.title}</td>
                        <td className="py-3">{o.customer.name}</td>
                        <td className="py-3"><StatusBadge status={o.status} /></td>
                        <td className="py-3 text-right">
                          <Link href={`/orders/${o.id}`} className="text-primary hover:underline">{tc('details')}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data?.meta && (
                <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
