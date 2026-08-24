'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { api } from '@/lib/api';

export default function InventoryPage() {
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Inventory</h2>
        <p className="text-muted-foreground">Materials, stock levels, and movements</p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button variant={tab === 'products' ? 'default' : 'outline'} onClick={() => { setTab('products'); setPage(1); }}>
          Materials
        </Button>
        <Button variant={tab === 'movements' ? 'default' : 'outline'} onClick={() => { setTab('movements'); setPage(1); }}>
          Movements
        </Button>
      </div>

      {tab === 'products' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-lg">Materials</CardTitle>
              <Input
                placeholder="Search..."
                className="w-40"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2">Stock</th>
                    <th className="pb-2">Min</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.data.map((p) => (
                    <tr key={p.id} className={`border-b ${p.currentStock < p.minStock ? 'bg-amber-50' : ''}`}>
                      <td className="py-2 font-medium">{p.name}</td>
                      <td className="py-2">{p.sku ?? '—'}</td>
                      <td className="py-2">{p.currentStock} {p.unit}</td>
                      <td className="py-2">{p.minStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products?.meta && (
                <Pagination page={products.meta.page} totalPages={products.meta.totalPages} onPageChange={setPage} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">New material</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={createProduct} className="space-y-3">
                <div><Label>Name</Label><Input name="name" required /></div>
                <div><Label>SKU</Label><Input name="sku" /></div>
                <div><Label>Unit</Label><Input name="unit" defaultValue="pcs" /></div>
                <div><Label>Unit cost</Label><Input name="unitCost" type="number" step="0.01" /></div>
                <div><Label>Current stock</Label><Input name="currentStock" type="number" /></div>
                <div><Label>Minimum stock</Label><Input name="minStock" type="number" /></div>
                <Button type="submit" className="w-full">Save</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'movements' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-lg">Recent movements</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {movements?.data.map((m) => (
                    <tr key={m.id} className="border-b">
                      <td className="py-2">{m.product.name}</td>
                      <td className="py-2">{m.type}</td>
                      <td className="py-2">{m.quantity}</td>
                      <td className="py-2">{new Date(m.createdAt).toLocaleDateString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {movements?.meta && (
                <Pagination page={movements.meta.page} totalPages={movements.meta.totalPages} onPageChange={setPage} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">New movement</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={createMovement} className="space-y-3">
                <div>
                  <Label>Product ID</Label>
                  <Input name="productId" required placeholder="Material ID" />
                  <Link href="#" onClick={(e) => e.preventDefault()} className="text-xs text-muted-foreground">
                    Copy ID from the Materials tab
                  </Link>
                </div>
                <div>
                  <Label>Type</Label>
                  <select name="type" className="w-full rounded-md border px-3 py-2 text-sm">
                    <option value="IN">Inbound (IN)</option>
                    <option value="OUT">Outbound (OUT)</option>
                  </select>
                </div>
                <div><Label>Quantity</Label><Input name="quantity" type="number" step="0.001" required /></div>
                <div><Label>Notes</Label><Input name="notes" /></div>
                <Button type="submit" className="w-full">Record</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
