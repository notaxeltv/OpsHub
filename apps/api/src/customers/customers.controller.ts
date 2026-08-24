import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  findAll(@Tenant() tenant: TenantContext, @Query('search') search?: string) {
    return this.customersService.findAll(tenant, search);
  }

  @Get(':id')
  findOne(@Tenant() tenant: TenantContext, @Param('id') id: string) {
    return this.customersService.findOne(tenant, id);
  }

  @Post()
  create(@Tenant() tenant: TenantContext, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(tenant, dto);
  }

  @Patch(':id')
  update(
    @Tenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(tenant, id, dto);
  }

  @Delete(':id')
  remove(@Tenant() tenant: TenantContext, @Param('id') id: string) {
    return this.customersService.remove(tenant, id);
  }
}
