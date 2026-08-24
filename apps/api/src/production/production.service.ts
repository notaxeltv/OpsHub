import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { CreateProductionEntryDto, UpdateProductionEntryDto } from './dto/production.dto';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  findAll(tenant: TenantContext, orderId?: string) {
    return this.prisma.productionEntry.findMany({
      where: {
        organizationId: tenant.organizationId,
        ...(orderId ? { orderId } : {}),
      },
      include: { order: { include: { customer: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(tenant: TenantContext, id: string) {
    const entry = await this.prisma.productionEntry.findFirst({
      where: { id, organizationId: tenant.organizationId },
      include: { order: true },
    });
    if (!entry) throw new NotFoundException('Production entry not found');
    return entry;
  }

  async create(tenant: TenantContext, dto: CreateProductionEntryDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, organizationId: tenant.organizationId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.productionEntry.create({
      data: {
        organizationId: tenant.organizationId,
        orderId: dto.orderId,
        hours: dto.hours ?? 0,
        materialCost: dto.materialCost ?? 0,
        hourlyCost: dto.hourlyCost,
        notes: dto.notes,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { order: true },
    });
  }

  async update(tenant: TenantContext, id: string, dto: UpdateProductionEntryDto) {
    await this.findOne(tenant, id);
    return this.prisma.productionEntry.update({
      where: { id },
      data: {
        hours: dto.hours,
        materialCost: dto.materialCost,
        hourlyCost: dto.hourlyCost,
        notes: dto.notes,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { order: true },
    });
  }

  async remove(tenant: TenantContext, id: string) {
    await this.findOne(tenant, id);
    return this.prisma.productionEntry.delete({ where: { id } });
  }
}
