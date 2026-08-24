'use client';

import { use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { title: '', reference: '', hourlyRate: 0, externalCosts: 0, notes: '' },
  });

  const { data } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.orders.get(id),
  });

  useEffect(() => {
    if (data) {
      const order = data as { title: string; reference: string; hourlyRate: number; externalCosts: number; notes?: string };
      reset({
        title: order.title,
        reference: order.reference,
        hourlyRate: Number(order.hourlyRate),
        externalCosts: Number(order.externalCosts),
        notes: order.notes ?? '',
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (form: Record<string, unknown>) => api.orders.update(id, form),
    onSuccess: () => router.push(`/orders/${id}`),
  });

  return (
    <AppShell>
      <div className="mb-6">
        <Link href={`/orders/${id}`} className="text-sm text-primary hover:underline">← Dettaglio commessa</Link>
        <h2 className="mt-2 text-2xl font-bold">Modifica commessa</h2>
      </div>

      <Card className="max-w-xl">
        <CardHeader><CardTitle>Dati commessa</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div><Label>Riferimento</Label><Input {...register('reference')} /></div>
            <div><Label>Titolo</Label><Input {...register('title')} /></div>
            <div><Label>Costo orario (€)</Label><Input type="number" step="0.01" {...register('hourlyRate', { valueAsNumber: true })} /></div>
            <div><Label>Spese esterne (€)</Label><Input type="number" step="0.01" {...register('externalCosts', { valueAsNumber: true })} /></div>
            <div><Label>Note</Label><Input {...register('notes')} /></div>
            <Button type="submit" disabled={mutation.isPending}>Salva modifiche</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
