import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll(tenant: TenantContext, search?: string) {
    return this.prisma.customer.findMany({
      where: {
        organizationId: tenant.organizationId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenant: TenantContext, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId: tenant.organizationId },
      include: { contacts: true, orders: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  create(tenant: TenantContext, dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: { ...dto, organizationId: tenant.organizationId },
    });
  }

  async update(tenant: TenantContext, id: string, dto: UpdateCustomerDto) {
    await this.findOne(tenant, id);
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async remove(tenant: TenantContext, id: string) {
    await this.findOne(tenant, id);
    return this.prisma.customer.delete({ where: { id } });
  }
}
