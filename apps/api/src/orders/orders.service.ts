import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { calculateOrderMargin } from '../common/services/margin.service';
import { toNumber } from '../common/utils/numbers';

const orderInclude = {
  customer: true,
  items: true,
  productionEntries: true,
} as const;

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll(tenant: TenantContext, status?: string) {
    return this.prisma.order.findMany({
      where: {
        organizationId: tenant.organizationId,
        ...(status ? { status: status as never } : {}),
      },
      include: { customer: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenant: TenantContext, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, organizationId: tenant.organizationId },
      include: orderInclude,
    });
    if (!order) throw new NotFoundException('Order not found');

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

    return { ...order, margin };
  }

  async create(tenant: TenantContext, dto: CreateOrderDto) {
    const { items, ...data } = dto;
    return this.prisma.order.create({
      data: {
        ...data,
        organizationId: tenant.organizationId,
        items: items?.length
          ? { create: items.map((item) => ({ ...item })) }
          : undefined,
      },
      include: orderInclude,
    });
  }

  async update(tenant: TenantContext, id: string, dto: UpdateOrderDto) {
    await this.findOne(tenant, id);
    const { items, ...data } = dto;

    if (items) {
      await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        ...data,
        items: items?.length
          ? { create: items.map((item) => ({ ...item })) }
          : undefined,
      },
      include: orderInclude,
    });
  }

  async remove(tenant: TenantContext, id: string) {
    await this.findOne(tenant, id);
    return this.prisma.order.delete({ where: { id } });
  }
}
