import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { PaginationQueryDto, paginate } from '../common/dto/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenant: TenantContext, query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy === 'createdAt' ? 'createdAt' : 'name';
    const sortOrder = query.sortOrder ?? 'asc';

    const where: Prisma.CustomerWhereInput = {
      organizationId: tenant.organizationId,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return paginate(data, total, page, limit);
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

  async createContact(tenant: TenantContext, customerId: string, dto: CreateContactDto) {
    await this.findOne(tenant, customerId);
    if (dto.isPrimary) {
      await this.prisma.contact.updateMany({
        where: { customerId },
        data: { isPrimary: false },
      });
    }
    return this.prisma.contact.create({ data: { ...dto, customerId } });
  }

  async updateContact(
    tenant: TenantContext,
    customerId: string,
    contactId: string,
    dto: UpdateContactDto,
  ) {
    await this.assertContactOwnership(tenant, customerId, contactId);
    if (dto.isPrimary) {
      await this.prisma.contact.updateMany({
        where: { customerId },
        data: { isPrimary: false },
      });
    }
    return this.prisma.contact.update({ where: { id: contactId }, data: dto });
  }

  async removeContact(tenant: TenantContext, customerId: string, contactId: string) {
    await this.assertContactOwnership(tenant, customerId, contactId);
    return this.prisma.contact.delete({ where: { id: contactId } });
  }

  private async assertContactOwnership(
    tenant: TenantContext,
    customerId: string,
    contactId: string,
  ) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, customerId, customer: { organizationId: tenant.organizationId } },
    });
    if (!contact) throw new ForbiddenException('Contact not found');
    return contact;
  }
}
