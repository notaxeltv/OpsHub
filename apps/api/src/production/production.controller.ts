import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductionService } from './production.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';
import { CreateProductionEntryDto, UpdateProductionEntryDto } from './dto/production.dto';

@Controller('production')
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  @Get()
  findAll(@Tenant() tenant: TenantContext, @Query('orderId') orderId?: string) {
    return this.productionService.findAll(tenant, orderId);
  }

  @Get(':id')
  findOne(@Tenant() tenant: TenantContext, @Param('id') id: string) {
    return this.productionService.findOne(tenant, id);
  }

  @Post()
  create(@Tenant() tenant: TenantContext, @Body() dto: CreateProductionEntryDto) {
    return this.productionService.create(tenant, dto);
  }

  @Patch(':id')
  update(
    @Tenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateProductionEntryDto,
  ) {
    return this.productionService.update(tenant, id, dto);
  }

  @Delete(':id')
  remove(@Tenant() tenant: TenantContext, @Param('id') id: string) {
    return this.productionService.remove(tenant, id);
  }
}
