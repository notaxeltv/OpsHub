import { Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify/sync';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { calculateOrderMargin } from '../common/services/margin.service';
import { roundCurrency, toNumber } from '../common/utils/numbers';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async dashboard(tenant: TenantContext) {
    const orgId = tenant.organizationId;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [orders, openOrders, customers, org] = await Promise.all([
      this.prisma.order.findMany({
        where: { organizationId: orgId },
        include: { items: true, productionEntries: true, customer: true },
      }),
      this.prisma.order.count({
        where: {
          organizationId: orgId,
          status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.customer.count({ where: { organizationId: orgId } }),
      this.prisma.organization.findUnique({ where: { id: orgId } }),
    ]);

    const defaultRate = org ? toNumber(org.defaultHourlyRate) : 35;
    let totalRevenue = 0;
    let totalMargin = 0;
    let monthRevenue = 0;

    const orderMargins = orders.map((order) => {
      const margin = calculateOrderMargin({
        items: order.items,
        productionEntries: order.productionEntries,
        hourlyRate: order.hourlyRate,
        externalCosts: order.externalCosts,
        defaultHourlyRate: defaultRate,
      });
      totalRevenue += margin.revenue;
      totalMargin += margin.margin;
      if (order.createdAt >= monthStart) monthRevenue += margin.revenue;
      return { order, margin };
    });

    const topCustomers = this.aggregateByCustomer(orderMargins);

    return {
      kpis: {
        totalRevenue: roundCurrency(totalRevenue),
        totalMargin: roundCurrency(totalMargin),
        monthRevenue: roundCurrency(monthRevenue),
        openOrders,
        totalCustomers: customers,
        averageMarginPercent:
          totalRevenue > 0 ? roundCurrency((totalMargin / totalRevenue) * 100) : 0,
      },
      topCustomers: topCustomers.slice(0, 5),
    };
  }

  async marginsByOrder(tenant: TenantContext) {
    const orders = await this.prisma.order.findMany({
      where: { organizationId: tenant.organizationId },
      include: { items: true, productionEntries: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });

    const org = await this.prisma.organization.findUnique({
      where: { id: tenant.organizationId },
    });
    const defaultRate = org ? toNumber(org.defaultHourlyRate) : 35;

    return orders.map((order) => ({
      orderId: order.id,
      reference: order.reference,
      title: order.title,
      customer: order.customer.name,
      status: order.status,
      margin: calculateOrderMargin({
        items: order.items,
        productionEntries: order.productionEntries,
        hourlyRate: order.hourlyRate,
        externalCosts: order.externalCosts,
        defaultHourlyRate: defaultRate,
      }),
    }));
  }

  async exportMarginsCsv(tenant: TenantContext): Promise<string> {
    const rows = await this.marginsByOrder(tenant);
    return stringify(
      rows.map((r) => ({
        reference: r.reference,
        title: r.title,
        customer: r.customer,
        status: r.status,
        revenue: r.margin.revenue,
        totalCost: r.margin.totalCost,
        margin: r.margin.margin,
        marginPercent: r.margin.marginPercent,
      })),
      { header: true },
    );
  }

  async exportOrderPdf(tenant: TenantContext, orderId: string): Promise<Buffer> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, organizationId: tenant.organizationId },
      include: { items: true, productionEntries: true, customer: true },
    });

    if (!order) throw new Error('Order not found');

    const org = await this.prisma.organization.findUnique({
      where: { id: tenant.organizationId },
    });
    const margin = calculateOrderMargin({
      items: order.items,
      productionEntries: order.productionEntries,
      hourlyRate: order.hourlyRate,
      externalCosts: order.externalCosts,
      defaultHourlyRate: org ? toNumber(org.defaultHourlyRate) : 35,
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('OpsHub - Riepilogo Commessa', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Riferimento: ${order.reference}`);
      doc.text(`Titolo: ${order.title}`);
      doc.text(`Cliente: ${order.customer.name}`);
      doc.text(`Stato: ${order.status}`);
      doc.moveDown();
      doc.text(`Ricavi: €${margin.revenue.toFixed(2)}`);
      doc.text(`Costi totali: €${margin.totalCost.toFixed(2)}`);
      doc.text(`Margine: €${margin.margin.toFixed(2)} (${margin.marginPercent}%)`);
      doc.end();
    });
  }

  private aggregateByCustomer(
    orderMargins: Array<{
      order: { customer: { id: string; name: string } };
      margin: { revenue: number; margin: number };
    }>,
  ) {
    const map = new Map<string, { name: string; revenue: number; margin: number }>();

    for (const { order, margin } of orderMargins) {
      const existing = map.get(order.customer.id) ?? {
        name: order.customer.name,
        revenue: 0,
        margin: 0,
      };
      existing.revenue += margin.revenue;
      existing.margin += margin.margin;
      map.set(order.customer.id, existing);
    }

    return [...map.values()]
      .map((c) => ({ ...c, revenue: roundCurrency(c.revenue), margin: roundCurrency(c.margin) }))
      .sort((a, b) => b.margin - a.margin);
  }
}
