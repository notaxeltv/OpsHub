'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', email: '', phone: '', role: '' },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => api.customers.get(id),
  });

  const contactMutation = useMutation({
    mutationFn: (form: Record<string, string>) => api.customers.createContact(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      reset();
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (contactId: string) => api.customers.deleteContact(id, contactId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer', id] }),
  });

  if (isLoading) return <AppShell><p>Loading...</p></AppShell>;

  const customer = data as {
    name: string;
    email?: string;
    phone?: string;
    vatNumber?: string;
    notes?: string;
    contacts?: Array<{ id: string; name: string; email?: string; phone?: string; role?: string; isPrimary: boolean }>;
    orders?: Array<{ id: string; reference: string; title: string; status: string }>;
  };

  return (
    <AppShell>
      <div className="mb-6">
        <Link href="/customers" className="text-sm text-primary hover:underline">← Customers</Link>
        <h2 className="mt-2 text-3xl font-bold">{customer?.name}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {customer?.email ?? '—'}</p>
            <p><span className="text-muted-foreground">Phone:</span> {customer?.phone ?? '—'}</p>
            <p><span className="text-muted-foreground">VAT:</span> {customer?.vatNumber ?? '—'}</p>
            <p><span className="text-muted-foreground">Notes:</span> {customer?.notes ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Recent orders</CardTitle></CardHeader>
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
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Contacts</CardTitle></CardHeader>
          <CardContent>
            {customer?.contacts?.length ? (
              <table className="mb-6 w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {customer.contacts.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2">{c.name}{c.isPrimary && ' ★'}</td>
                      <td className="py-2">{c.email ?? '—'}</td>
                      <td className="py-2">{c.role ?? '—'}</td>
                      <td className="py-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteContactMutation.mutate(c.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mb-4 text-sm text-muted-foreground">No contacts yet.</p>
            )}

            <form
              onSubmit={handleSubmit((d) => contactMutation.mutate(d))}
              className="grid gap-3 sm:grid-cols-2"
            >
              <div><Label>Name</Label><Input {...register('name', { required: true })} /></div>
              <div><Label>Email</Label><Input type="email" {...register('email')} /></div>
              <div><Label>Phone</Label><Input {...register('phone')} /></div>
              <div><Label>Role</Label><Input {...register('role')} /></div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={contactMutation.isPending}>Add contact</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
