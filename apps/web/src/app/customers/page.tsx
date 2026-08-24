'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const { data, isLoading } = useQuery({ queryKey: ['customers'], queryFn: () => api.customers.list() });

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Clienti</h2>
          <p className="text-muted-foreground">Gestisci l&apos;anagrafica clienti</p>
        </div>
        <Button asChild><Link href="/customers/new">Nuovo cliente</Link></Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Lista clienti</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Caricamento...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Nome</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Telefono</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {data?.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3">{c.email ?? '—'}</td>
                    <td className="py-3">{c.phone ?? '—'}</td>
                    <td className="py-3 text-right">
                      <Link href={`/customers/${c.id}`} className="text-primary hover:underline">Dettaglio</Link>
                    </td>
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
