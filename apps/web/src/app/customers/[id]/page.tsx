'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => api.customers.get(id),
  });

  if (isLoading) return <AppShell><p>Caricamento...</p></AppShell>;

  const customer = data as {
    name: string;
    email?: string;
    phone?: string;
    vatNumber?: string;
    notes?: string;
    orders?: Array<{ id: string; reference: string; title: string; status: string }>;
  };

  return (
    <AppShell>
      <div className="mb-6">
        <Link href="/customers" className="text-sm text-primary hover:underline">← Clienti</Link>
        <h2 className="mt-2 text-3xl font-bold">{customer?.name}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Anagrafica</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {customer?.email ?? '—'}</p>
            <p><span className="text-muted-foreground">Telefono:</span> {customer?.phone ?? '—'}</p>
            <p><span className="text-muted-foreground">P.IVA:</span> {customer?.vatNumber ?? '—'}</p>
            <p><span className="text-muted-foreground">Note:</span> {customer?.notes ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Commesse recenti</CardTitle></CardHeader>
          <CardContent>
            {customer?.orders?.length ? (
              <ul className="space-y-2 text-sm">
                {customer.orders.map((o) => (
                  <li key={o.id}>
                    <Link href={`/orders/${o.id}`} className="text-primary hover:underline">
                      {o.reference} — {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nessuna commessa.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
