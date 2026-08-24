import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';
import {
  CreateInventoryMovementDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/inventory.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('products')
  listProducts(@Tenant() tenant: TenantContext, @Query() query: PaginationQueryDto) {
    return this.inventoryService.findAllProducts(tenant, query);
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
  listMovements(
    @Tenant() tenant: TenantContext,
    @Query() query: PaginationQueryDto,
    @Query('productId') productId?: string,
  ) {
    return this.inventoryService.findMovements(tenant, query, productId);
  }

  @Post('movements')
  createMovement(@Tenant() tenant: TenantContext, @Body() dto: CreateInventoryMovementDto) {
    return this.inventoryService.createMovement(tenant, dto);
  }

  @Get('alerts/low-stock')
  lowStockAlerts(@Tenant() tenant: TenantContext) {
    return this.inventoryService.getLowStockAlerts(tenant);
  }
}
