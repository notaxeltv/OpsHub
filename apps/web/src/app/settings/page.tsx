'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Free',
  STARTER: 'Starter',
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise',
};

export default function SettingsPage() {
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: () => api.me() });
  const { data: billing, refetch } = useQuery({ queryKey: ['billing'], queryFn: () => api.billing.status() });

  const checkoutMutation = useMutation({
    mutationFn: (plan: string) => api.billing.checkout(plan),
    onSuccess: (res) => {
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else if (res.message) {
        alert(res.message);
      }
      refetch();
    },
  });

  return (
    <AppShell>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Organization and account</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {me?.user.firstName} {me?.user.lastName}</p>
            <p><span className="text-muted-foreground">Email:</span> {me?.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Organizations</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {me?.organizations.map((o) => (
                <li key={o.id} className="rounded border p-3">{o.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Subscription</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-6">
              <p>
                <span className="text-muted-foreground">Current plan:</span>{' '}
                <strong>{PLAN_LABELS[billing?.currentPlan ?? 'FREE'] ?? billing?.currentPlan}</strong>
              </p>
              <p>
                <span className="text-muted-foreground">Customers:</span>{' '}
                {billing?.usage.customers}
                {billing?.limits.maxCustomers != null && ` / ${billing.limits.maxCustomers}`}
              </p>
              <p>
                <span className="text-muted-foreground">Orders:</span>{' '}
                {billing?.usage.orders}
                {billing?.limits.maxOrders != null && ` / ${billing.limits.maxOrders}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {billing?.upgradeablePlans.map((plan) => (
                <Button
                  key={plan}
                  variant="outline"
                  size="sm"
                  disabled={checkoutMutation.isPending || billing.currentPlan === plan}
                  onClick={() => checkoutMutation.mutate(plan)}
                >
                  Upgrade to {PLAN_LABELS[plan] ?? plan}
                </Button>
              ))}
            </div>

            {!billing?.enabled && (
              <p className="text-muted-foreground">
                Stripe is not configured on the server. In production, set STRIPE_SECRET_KEY and the Price IDs.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
