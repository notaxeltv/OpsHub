import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';
import {
  CreateInventoryMovementDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('products')
  listProducts(@Tenant() tenant: TenantContext) {
    return this.inventoryService.findAllProducts(tenant);
  }

  @Get('products/:id')
  getProduct(@Tenant() tenant: TenantContext, @Param('id') id: string) {
    return this.inventoryService.findProduct(tenant, id);
  }

  @Post('products')
  createProduct(@Tenant() tenant: TenantContext, @Body() dto: CreateProductDto) {
    return this.inventoryService.createProduct(tenant, dto);
  }

  @Patch('products/:id')
  updateProduct(
    @Tenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.inventoryService.updateProduct(tenant, id, dto);
  }

  @Get('movements')
  listMovements(@Tenant() tenant: TenantContext, @Query('productId') productId?: string) {
    return this.inventoryService.findMovements(tenant, productId);
  }

  @Post('movements')
  createMovement(@Tenant() tenant: TenantContext, @Body() dto: CreateInventoryMovementDto) {
    return this.inventoryService.createMovement(tenant, dto);
  }
}
