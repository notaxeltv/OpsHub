'use client';

import { useTranslations } from 'next-intl';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');
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

  const currentPlan = billing?.currentPlan ?? 'FREE';

  return (
    <AppShell>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">{t('profile')}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">{tc('name')}:</span> {me?.user.firstName} {me?.user.lastName}</p>
            <p><span className="text-muted-foreground">{tc('email')}:</span> {me?.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">{t('organizations')}</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {me?.organizations.map((o) => (
                <li key={o.id} className="rounded border p-3">{o.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">{t('subscription')}</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-6">
              <p>
                <span className="text-muted-foreground">{t('currentPlan')}</span>{' '}
                <strong>{t(`plans.${currentPlan}`)}</strong>
              </p>
              <p>
                <span className="text-muted-foreground">{t('customers')}</span>{' '}
                {billing?.usage.customers}
                {billing?.limits.maxCustomers != null && ` / ${billing.limits.maxCustomers}`}
              </p>
              <p>
                <span className="text-muted-foreground">{t('orders')}</span>{' '}
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
                  {t('upgrade', { plan: t(`plans.${plan}`) })}
                </Button>
              ))}
            </div>

            {!billing?.enabled && (
              <p className="text-muted-foreground">
                {t('stripeNotConfigured')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
