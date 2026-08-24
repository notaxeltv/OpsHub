'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => api.customers.list({ page, limit: 10, search: search || undefined }),
  });

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Customers</h2>
          <p className="text-muted-foreground">Manage your customer directory</p>
        </div>
        <Button asChild><Link href="/customers/new">New customer</Link></Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Customer list</CardTitle>
          <form
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
          >
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-48"
            />
            <Button type="submit" variant="outline" size="sm">Search</Button>
          </form>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Phone</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3">{c.email ?? '—'}</td>
                      <td className="py-3">{c.phone ?? '—'}</td>
                      <td className="py-3 text-right">
                        <Link href={`/customers/${c.id}`} className="text-primary hover:underline">Details</Link>
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
