import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  findAll(@Tenant() tenant: TenantContext, @Query() query: PaginationQueryDto) {
    return this.customersService.findAll(tenant, query);
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

  @Post(':id/contacts')
  createContact(
    @Tenant() tenant: TenantContext,
    @Param('id') customerId: string,
    @Body() dto: CreateContactDto,
  ) {
    return this.customersService.createContact(tenant, customerId, dto);
  }

  @Patch(':id/contacts/:contactId')
  updateContact(
    @Tenant() tenant: TenantContext,
    @Param('id') customerId: string,
    @Param('contactId') contactId: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.customersService.updateContact(tenant, customerId, contactId, dto);
  }

  @Delete(':id/contacts/:contactId')
  removeContact(
    @Tenant() tenant: TenantContext,
    @Param('id') customerId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.customersService.removeContact(tenant, customerId, contactId);
  }
}
