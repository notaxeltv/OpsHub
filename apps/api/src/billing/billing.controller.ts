import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Headers,
  HttpCode,
  RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { BillingService } from './billing.service';
import { Tenant, TenantContext, Public, Roles } from '../common/decorators/auth.decorators';
import { CreateCheckoutDto } from './dto/billing.dto';
import { MembershipRole } from '@prisma/client';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('status')
  status(@Tenant() tenant: TenantContext) {
    return this.billingService.getStatus(tenant);
  }

  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @Post('checkout')
  checkout(@Tenant() tenant: TenantContext, @Body() dto: CreateCheckoutDto) {
    return this.billingService.createCheckout(tenant, dto);
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody ?? Buffer.from('');
    return this.billingService.handleWebhook(rawBody, signature ?? '');
  }
}
