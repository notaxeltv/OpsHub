import { Controller, Get, Patch, Body } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';
import { UpdateOrganizationDto } from './dto/organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get('current')
  getCurrent(@Tenant() tenant: TenantContext) {
    return this.organizationsService.findOne(tenant);
  }

  @Patch('current')
  update(@Tenant() tenant: TenantContext, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(tenant, dto);
  }
}
