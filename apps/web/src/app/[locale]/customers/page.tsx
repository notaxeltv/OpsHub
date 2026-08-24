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
import { api } from '@/lib/api';

export default function CustomersPage() {
  const t = useTranslations('customers');
  const tc = useTranslations('common');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => api.customers.list({ page, limit: 10, search: search || undefined }),
  });

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button asChild><Link href="/customers/new">{t('new')}</Link></Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">{t('list')}</CardTitle>
          <form
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
          >
            <Input
              placeholder={tc('search')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-48"
            />
            <Button type="submit" variant="outline" size="sm">{tc('search')}</Button>
          </form>
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
                      <th className="pb-2">{tc('name')}</th>
                      <th className="pb-2">{tc('email')}</th>
                      <th className="pb-2">{tc('phone')}</th>
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
                          <Link href={`/customers/${c.id}`} className="text-primary hover:underline">{tc('details')}</Link>
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
