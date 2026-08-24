'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
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
  const t = useTranslations('orders');
  const tc = useTranslations('common');
  const { data: customers } = useQuery({
    queryKey: ['customers-all'],
    queryFn: () => api.customers.list({ limit: 100 }),
  });
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
        <CardHeader><CardTitle>{t('new')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <Label>{t('customer')}</Label>
              <select className="flex h-10 w-full rounded-md border px-3 text-sm" {...register('customerId')}>
                <option value="">{tc('select')}</option>
                {customers?.data.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><Label>{t('reference')}</Label><Input {...register('reference')} placeholder="ORD-2024-001" /></div>
            <div><Label>{t('orderTitle')}</Label><Input {...register('title')} /></div>
            <div><Label>{t('hourlyRate')}</Label><Input type="number" step="0.01" {...register('hourlyRate')} /></div>

            <div className="space-y-2">
              <Label>{t('lineItems')}</Label>
              {fields.map((field, i) => (
                <div key={field.id} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Input placeholder={t('description')} {...register(`items.${i}.description`)} />
                  <Input type="number" placeholder={t('qty')} {...register(`items.${i}.quantity`)} />
                  <Input type="number" step="0.01" placeholder={t('price')} {...register(`items.${i}.unitPrice`)} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
                {t('addLine')}
              </Button>
            </div>

            <Button type="submit" disabled={mutation.isPending}>{t('create')}</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
