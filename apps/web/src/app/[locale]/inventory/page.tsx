'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';

export default function InventoryPage() {
  const locale = useLocale();
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
  const [tab, setTab] = useState<'products' | 'movements'>('products');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ['inventory-products', page, search],
    queryFn: () => api.inventory.products({ page, limit: 10, search: search || undefined }),
    enabled: tab === 'products',
  });

  const { data: movements, refetch: refetchMovements } = useQuery({
    queryKey: ['inventory-movements', page],
    queryFn: () => api.inventory.movements({ page, limit: 10 }),
    enabled: tab === 'movements',
  });

  async function createProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.inventory.createProduct({
      name: form.get('name'),
      sku: form.get('sku'),
      unit: form.get('unit') || 'pcs',
      unitCost: parseFloat(form.get('unitCost') as string) || 0,
      currentStock: parseFloat(form.get('currentStock') as string) || 0,
      minStock: parseFloat(form.get('minStock') as string) || 0,
    });
    (e.target as HTMLFormElement).reset();
    refetchProducts();
  }

  async function createMovement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.inventory.createMovement({
      productId: form.get('productId'),
      type: form.get('type'),
      quantity: parseFloat(form.get('quantity') as string),
      notes: form.get('notes'),
    });
    (e.target as HTMLFormElement).reset();
    refetchMovements();
    refetchProducts();
  }

  return (
    <AppShell>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={tab === 'products' ? 'default' : 'outline'} onClick={() => { setTab('products'); setPage(1); }}>
          {t('materials')}
        </Button>
        <Button variant={tab === 'movements' ? 'default' : 'outline'} onClick={() => { setTab('movements'); setPage(1); }}>
          {t('movements')}
        </Button>
      </div>

      {tab === 'products' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg">{t('materials')}</CardTitle>
              <Input
                placeholder={tc('search')}
                className="w-full sm:w-40"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">{tc('name')}</th>
                      <th className="pb-2">{t('sku')}</th>
                      <th className="pb-2">{t('stock')}</th>
                      <th className="pb-2">{t('min')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.data.map((p) => (
                      <tr key={p.id} className={`border-b ${p.currentStock < p.minStock ? 'bg-amber-50 dark:bg-amber-950/30' : ''}`}>
                        <td className="py-2 font-medium">{p.name}</td>
                        <td className="py-2">{p.sku ?? '—'}</td>
                        <td className="py-2">{p.currentStock} {p.unit}</td>
                        <td className="py-2">{p.minStock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products?.meta && (
                <Pagination page={products.meta.page} totalPages={products.meta.totalPages} onPageChange={setPage} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">{t('newMaterial')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={createProduct} className="space-y-3">
                <div><Label>{tc('name')}</Label><Input name="name" required /></div>
                <div><Label>{t('sku')}</Label><Input name="sku" /></div>
                <div><Label>{t('unit')}</Label><Input name="unit" defaultValue="pcs" /></div>
                <div><Label>{t('unitCost')}</Label><Input name="unitCost" type="number" step="0.01" /></div>
                <div><Label>{t('currentStock')}</Label><Input name="currentStock" type="number" /></div>
                <div><Label>{t('minStock')}</Label><Input name="minStock" type="number" /></div>
                <Button type="submit" className="w-full">{tc('save')}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'movements' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-lg">{t('recentMovements')}</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">{t('product')}</th>
                      <th className="pb-2">{t('type')}</th>
                      <th className="pb-2">{t('quantity')}</th>
                      <th className="pb-2">{t('date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements?.data.map((m) => (
                      <tr key={m.id} className="border-b">
                        <td className="py-2">{m.product.name}</td>
                        <td className="py-2">{m.type}</td>
                        <td className="py-2">{m.quantity}</td>
                        <td className="py-2">{formatDate(m.createdAt, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {movements?.meta && (
                <Pagination page={movements.meta.page} totalPages={movements.meta.totalPages} onPageChange={setPage} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">{t('newMovement')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={createMovement} className="space-y-3">
                <div>
                  <Label>{t('productId')}</Label>
                  <Input name="productId" required placeholder={t('materialId')} />
                  <Link href="#" onClick={(e) => e.preventDefault()} className="text-xs text-muted-foreground">
                    {t('copyId')}
                  </Link>
                </div>
                <div>
                  <Label>{t('type')}</Label>
                  <select name="type" className="w-full rounded-md border px-3 py-2 text-sm">
                    <option value="IN">{t('inbound')}</option>
                    <option value="OUT">{t('outbound')}</option>
                  </select>
                </div>
                <div><Label>{t('quantity')}</Label><Input name="quantity" type="number" step="0.001" required /></div>
                <div><Label>{tc('notes')}</Label><Input name="notes" /></div>
                <Button type="submit" className="w-full">{t('record')}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
