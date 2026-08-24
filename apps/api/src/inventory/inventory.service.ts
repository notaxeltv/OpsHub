import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { CreateInventoryMovementDto, CreateProductDto, UpdateProductDto } from './dto/inventory.dto';
import { toNumber } from '../common/utils/numbers';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAllProducts(tenant: TenantContext) {
    return this.prisma.product.findMany({
      where: { organizationId: tenant.organizationId },
      orderBy: { name: 'asc' },
    });
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

  findMovements(tenant: TenantContext, productId?: string) {
    return this.prisma.inventoryMovement.findMany({
      where: {
        organizationId: tenant.organizationId,
        ...(productId ? { productId } : {}),
      },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMovement(tenant: TenantContext, dto: CreateInventoryMovementDto) {
    const product = await this.findProduct(tenant, dto.productId);
    const current = toNumber(product.currentStock);
    const delta = dto.type === MovementType.IN ? dto.quantity : -dto.quantity;
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

  // TODO: auto-deduct stock from production entries when inventory integration is complete
}
