'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

const schema = z.object({
  customerId: z.string().min(1),
  reference: z.string().min(1),
  title: z.string().min(1),
  hourlyRate: z.coerce.number().min(0).optional(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.coerce.number().min(0),
    unitPrice: z.coerce.number().min(0),
  })).optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewOrderPage() {
  const router = useRouter();
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: () => api.customers.list() });
  const { register, handleSubmit, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ description: '', quantity: 1, unitPrice: 0 }] },
  });
  const { fields, append } = useFieldArray({ control, name: 'items' });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.orders.create(data),
    onSuccess: (o: { id: string }) => router.push(`/orders/${o.id}`),
  });

  return (
    <AppShell>
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Nuova commessa</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <Label>Cliente</Label>
              <select className="flex h-10 w-full rounded-md border px-3 text-sm" {...register('customerId')}>
                <option value="">Seleziona...</option>
                {customers?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><Label>Riferimento</Label><Input {...register('reference')} placeholder="COMM-2024-001" /></div>
            <div><Label>Titolo</Label><Input {...register('title')} /></div>
            <div><Label>Costo orario (€)</Label><Input type="number" step="0.01" {...register('hourlyRate')} /></div>

            <div className="space-y-2">
              <Label>Righe</Label>
              {fields.map((field, i) => (
                <div key={field.id} className="grid grid-cols-3 gap-2">
                  <Input placeholder="Descrizione" {...register(`items.${i}.description`)} />
                  <Input type="number" placeholder="Qtà" {...register(`items.${i}.quantity`)} />
                  <Input type="number" step="0.01" placeholder="Prezzo" {...register(`items.${i}.unitPrice`)} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
                + Riga
              </Button>
            </div>

            <Button type="submit" disabled={mutation.isPending}>Crea commessa</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
