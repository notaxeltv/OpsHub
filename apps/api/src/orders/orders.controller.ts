import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll(@Tenant() tenant: TenantContext, @Query('status') status?: string) {
    return this.ordersService.findAll(tenant, status);
  }

  @Get(':id')
  findOne(@Tenant() tenant: TenantContext, @Param('id') id: string) {
    return this.ordersService.findOne(tenant, id);
  }

  @Post()
  create(@Tenant() tenant: TenantContext, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(tenant, dto);
  }

  @Patch(':id')
  update(
    @Tenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(tenant, id, dto);
  }

  @Delete(':id')
  remove(@Tenant() tenant: TenantContext, @Param('id') id: string) {
    return this.ordersService.remove(tenant, id);
  }
}
