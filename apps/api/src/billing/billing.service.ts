import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Billing module — Stripe/Lemon Squeezy integration placeholder.
 * TODO: implement checkout sessions, webhooks, and plan enforcement.
 */
@Injectable()
export class BillingService {
  constructor(private configService: ConfigService) {}

  getStatus() {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    return {
      enabled: Boolean(stripeKey),
      provider: 'stripe',
      message: stripeKey
        ? 'Stripe configured — checkout not yet implemented'
        : 'TODO: configure STRIPE_SECRET_KEY for subscription billing',
      plans: ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'],
    };
  }
}
