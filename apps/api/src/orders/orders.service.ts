import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { calculateOrderMargin } from '../common/services/margin.service';
import { toNumber } from '../common/utils/numbers';
import { paginate } from '../common/dto/pagination.dto';

const orderInclude = {
  customer: true,
  items: true,
  productionEntries: true,
} as const;

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenant: TenantContext, query: OrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy === 'reference' ? 'reference' : 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.OrderWhereInput = {
      organizationId: tenant.organizationId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { reference: { contains: query.search, mode: 'insensitive' } },
              { title: { contains: query.search, mode: 'insensitive' } },
              { customer: { name: { contains: query.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { customer: true, items: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return paginate(data, total, page, limit);
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
