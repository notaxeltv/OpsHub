'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';

const STATUSES = ['', 'DRAFT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'INVOICED'];

export default function OrdersPage() {
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Commesse</h2>
          <p className="text-muted-foreground">Gestisci ordini e progetti</p>
        </div>
        <Button asChild><Link href="/orders/new">Nuova commessa</Link></Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-lg">Lista commesse</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Cerca..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-40"
            />
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s || 'Tutti gli stati'}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Caricamento...</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Riferimento</th>
                    <th className="pb-2">Titolo</th>
                    <th className="pb-2">Cliente</th>
                    <th className="pb-2">Stato</th>
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
                        <Link href={`/orders/${o.id}`} className="text-primary hover:underline">Dettaglio</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
