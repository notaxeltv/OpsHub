'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function ProductionPage() {
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Produzione</h2>
        <p className="text-muted-foreground">Ore e materiali registrati per commessa</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Attività recenti</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Caricamento...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Commessa</th>
                  <th className="pb-2">Cliente</th>
                  <th className="pb-2">Ore</th>
                  <th className="pb-2">Materiali</th>
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
                    <td className="py-3">{formatCurrency(e.materialCost)}</td>
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
