'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/status-badge';

export default function OrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => api.orders.list() });

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
        <CardHeader><CardTitle className="text-lg">Lista commesse</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Caricamento...</p>
          ) : (
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
                {data?.map((o) => (
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
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
