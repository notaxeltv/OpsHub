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
          <h2 className="text-3xl font-bold">Orders</h2>
          <p className="text-muted-foreground">Manage job orders and projects</p>
        </div>
        <Button asChild><Link href="/orders/new">New order</Link></Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-lg">Order list</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search..."
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
                <option key={s} value={s}>{s || 'All statuses'}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Reference</th>
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Status</th>
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
                        <Link href={`/orders/${o.id}`} className="text-primary hover:underline">Details</Link>
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
