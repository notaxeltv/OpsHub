'use client';

import { use, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { StatusBadge } from '@/components/status-badge';

const ORDER_STATUSES = ['DRAFT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'INVOICED'] as const;

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations('orders');
  const tc = useTranslations('common');
  const ts = useTranslations('status');
  const [hours, setHours] = useState('2');
  const [materialCost, setMaterialCost] = useState('0');
  const [productId, setProductId] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');

  const { data: products } = useQuery({
    queryKey: ['inventory-products-select'],
    queryFn: () => api.inventory.products({ limit: 100 }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.orders.get(id),
  });

  const productionMutation = useMutation({
    mutationFn: () =>
      api.production.create({
        orderId: id,
        hours: parseFloat(hours),
        materialCost: materialCost ? parseFloat(materialCost) : undefined,
        productId: productId || undefined,
        materialQuantity: materialQuantity ? parseFloat(materialQuantity) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      setHours('2');
      setMaterialCost('0');
      setProductId('');
      setMaterialQuantity('');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.orders.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order', id] }),
  });

  if (isLoading) return <AppShell><p>{tc('loading')}</p></AppShell>;

  const order = data as {
    reference: string;
    title: string;
    status: string;
    customer: { name: string };
    items: Array<{ description: string; quantity: number; unitPrice: number }>;
    productionEntries: Array<{ id: string; hours: number; materialCost: number; date: string }>;
    margin: { revenue: number; totalCost: number; margin: number; marginPercent: number; laborCost: number; materialCost: number };
  };

  return (
    <AppShell>
      <div className="mb-6">
        <Link href="/orders" className="text-sm text-primary hover:underline">{t('back')}</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold sm:text-3xl">{order.reference}</h2>
          <StatusBadge status={order.status} />
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={order.status}
            onChange={(e) => statusMutation.mutate(e.target.value)}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{ts(s)}</option>
            ))}
          </select>
          <Link href={`/orders/${id}/edit`} className="text-sm text-primary hover:underline">{tc('edit')}</Link>
        </div>
        <p className="text-muted-foreground">{order.title} · {order.customer.name}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">{t('lineItems')}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">{t('description')}</th>
                    <th className="pb-2">{t('qty')}</th>
                    <th className="pb-2">{t('price')}</th>
                    <th className="pb-2">{t('total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">{formatCurrency(item.unitPrice, locale)}</td>
                      <td className="py-2">{formatCurrency(item.quantity * item.unitPrice, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">{t('margins')}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{t('revenue')}: <strong>{formatCurrency(order.margin.revenue, locale)}</strong></p>
            <p>{t('laborCost')}: {formatCurrency(order.margin.laborCost, locale)}</p>
            <p>{t('materialCost')}: {formatCurrency(order.margin.materialCost, locale)}</p>
            <p>{t('totalCosts')}: {formatCurrency(order.margin.totalCost, locale)}</p>
            <p className="text-lg font-bold text-primary">
              {t('margin')}: {formatCurrency(order.margin.margin, locale)} ({order.margin.marginPercent}%)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">{t('logProduction')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>{t('hours')}</Label><Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
            <div>
              <Label>{t('materialInventory')}</Label>
              <select
                className="flex h-10 w-full rounded-md border px-3 text-sm"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">{tc('none')}</option>
                {products?.data.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({t('stock')}: {p.currentStock})</option>
                ))}
              </select>
            </div>
            {productId && (
              <div><Label>{t('materialQty')}</Label><Input type="number" step="0.001" value={materialQuantity} onChange={(e) => setMaterialQuantity(e.target.value)} /></div>
            )}
            <div><Label>{t('manualMaterialCost')}</Label><Input type="number" value={materialCost} onChange={(e) => setMaterialCost(e.target.value)} placeholder={t('optionalIfMaterial')} /></div>
            <Button onClick={() => productionMutation.mutate()} disabled={productionMutation.isPending}>
              {t('addActivity')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">{t('loggedActivities')}</CardTitle></CardHeader>
          <CardContent>
            {order.productionEntries?.length ? (
              <ul className="space-y-2 text-sm">
                {order.productionEntries.map((e) => (
                  <li key={e.id} className="border-b pb-2">
                    {e.hours}h · {t('materials')} {formatCurrency(e.materialCost, locale)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('noActivities')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
