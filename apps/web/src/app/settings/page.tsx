'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { data } = useQuery({ queryKey: ['me'], queryFn: () => api.me() });

  return (
    <AppShell>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Impostazioni</h2>
        <p className="text-muted-foreground">Organizzazione e account</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Profilo</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> {data?.user.firstName} {data?.user.lastName}</p>
            <p><span className="text-muted-foreground">Email:</span> {data?.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Organizzazioni</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data?.organizations.map((o) => (
                <li key={o.id} className="rounded border p-3">{o.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Subscription</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              TODO: integrazione Stripe/Lemon Squeezy per piani STARTER, PRO, ENTERPRISE.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
