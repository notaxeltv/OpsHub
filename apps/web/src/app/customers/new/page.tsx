'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  vatNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewCustomerPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (data: FormData) => api.customers.create(data as Record<string, string>),
    onSuccess: (c: { id: string }) => router.push(`/customers/${c.id}`),
  });

  return (
    <AppShell>
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Nuovo cliente</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div><Label>Nome</Label><Input {...register('name')} /></div>
            <div><Label>Email</Label><Input type="email" {...register('email')} /></div>
            <div><Label>Telefono</Label><Input {...register('phone')} /></div>
            <div><Label>P.IVA</Label><Input {...register('vatNumber')} /></div>
            <div><Label>Note</Label><Input {...register('notes')} /></div>
            <Button type="submit" disabled={mutation.isPending}>Salva</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
