import { Controller, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('status')
  status(@Tenant() _tenant: TenantContext) {
    return this.billingService.getStatus();
  }
}
