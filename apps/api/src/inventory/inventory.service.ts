import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { CreateInventoryMovementDto, CreateProductDto, UpdateProductDto } from './dto/inventory.dto';
import { PaginationQueryDto, paginate } from '../common/dto/pagination.dto';
import { toNumber } from '../common/utils/numbers';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAllProducts(tenant: TenantContext, query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.ProductWhereInput = {
      organizationId: tenant.organizationId,
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' } }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findProduct(tenant: TenantContext, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, organizationId: tenant.organizationId },
      include: { inventoryMovements: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  createProduct(tenant: TenantContext, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: { ...dto, organizationId: tenant.organizationId },
    });
  }

  async updateProduct(tenant: TenantContext, id: string, dto: UpdateProductDto) {
    await this.findProduct(tenant, id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async findMovements(tenant: TenantContext, query: PaginationQueryDto, productId?: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.InventoryMovementWhereInput = {
      organizationId: tenant.organizationId,
      ...(productId ? { productId } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.inventoryMovement.findMany({
        where,
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.inventoryMovement.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async createMovement(tenant: TenantContext, dto: CreateInventoryMovementDto) {
    const product = await this.findProduct(tenant, dto.productId);
    const current = toNumber(product.currentStock);
    const delta = dto.type === 'IN' ? dto.quantity : -dto.quantity;
    const newStock = current + delta;

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: dto.productId },
        data: { currentStock: newStock },
      });

      return tx.inventoryMovement.create({
        data: {
          organizationId: tenant.organizationId,
          productId: dto.productId,
          type: dto.type,
          quantity: dto.quantity,
          reference: dto.reference,
          orderId: dto.orderId,
          productionEntryId: dto.productionEntryId,
          notes: dto.notes,
        },
        include: { product: true },
      });
    });
  }
}
