import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionPlan } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { PLAN_LIMITS, UPGRADEABLE_PLANS } from './plan-limits';
import { CreateCheckoutDto } from './dto/billing.dto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private getStripe(): Stripe | null {
    const key = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!key) return null;
    return new Stripe(key);
  }

  async getStatus(tenant: TenantContext) {
    const org = await this.prisma.organization.findUnique({
      where: { id: tenant.organizationId },
    });
    if (!org) throw new BadRequestException('Organization not found');

    const limits = PLAN_LIMITS[org.plan];
    const [customerCount, orderCount] = await Promise.all([
      this.prisma.customer.count({ where: { organizationId: org.id } }),
      this.prisma.order.count({ where: { organizationId: org.id } }),
    ]);

    return {
      enabled: Boolean(this.getStripe()),
      provider: 'stripe',
      currentPlan: org.plan,
      limits,
      usage: { customers: customerCount, orders: orderCount },
      upgradeablePlans: UPGRADEABLE_PLANS,
      stripeCustomerId: org.stripeCustomerId,
    };
  }

  async createCheckout(tenant: TenantContext, dto: CreateCheckoutDto) {
    const stripe = this.getStripe();
    const org = await this.prisma.organization.findUnique({
      where: { id: tenant.organizationId },
    });
    if (!org) throw new BadRequestException('Organization not found');

    if (!UPGRADEABLE_PLANS.includes(dto.plan)) {
      throw new BadRequestException('Invalid plan for checkout');
    }

    if (!stripe) {
      return {
        mock: true,
        plan: dto.plan,
        message: 'Stripe non configurato. Imposta STRIPE_SECRET_KEY per abilitare il checkout.',
        checkoutUrl: null,
      };
    }

    const priceId = this.getPriceId(dto.plan);
    if (!priceId) {
      throw new BadRequestException(`Price ID not configured for plan ${dto.plan}`);
    }

    const frontendUrl = this.configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: org.stripeCustomerId ?? undefined,
      customer_email: org.stripeCustomerId ? undefined : tenant.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/settings?billing=success`,
      cancel_url: `${frontendUrl}/settings?billing=cancel`,
      metadata: { organizationId: org.id, plan: dto.plan },
    });

    if (session.customer && typeof session.customer === 'string' && !org.stripeCustomerId) {
      await this.prisma.organization.update({
        where: { id: org.id },
        data: { stripeCustomerId: session.customer },
      });
    }

    return { mock: false, checkoutUrl: session.url, sessionId: session.id };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const stripe = this.getStripe();
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!stripe || !webhookSecret) {
      this.logger.warn('Stripe webhook received but Stripe is not fully configured');
      return { received: true, processed: false };
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${(err as Error).message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organizationId;
      const plan = session.metadata?.plan as SubscriptionPlan | undefined;

      if (organizationId && plan && UPGRADEABLE_PLANS.includes(plan)) {
        await this.prisma.organization.update({
          where: { id: organizationId },
          data: {
            plan,
            stripeCustomerId:
              typeof session.customer === 'string' ? session.customer : orgStripeId(session),
            inventoryEnabled: PLAN_LIMITS[plan].inventoryEnabled,
          },
        });
        this.logger.log(`Organization ${organizationId} upgraded to ${plan}`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const org = await this.prisma.organization.findFirst({
        where: { stripeCustomerId: subscription.customer as string },
      });
      if (org) {
        await this.prisma.organization.update({
          where: { id: org.id },
          data: { plan: SubscriptionPlan.FREE, inventoryEnabled: false },
        });
      }
    }

    return { received: true, processed: true };
  }

  async assertWithinPlanLimits(
    organizationId: string,
    resource: 'customers' | 'orders',
  ) {
    const org = await this.prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) return;

    const limits = PLAN_LIMITS[org.plan];
    const max = resource === 'customers' ? limits.maxCustomers : limits.maxOrders;
    if (max === null) return;

    const count =
      resource === 'customers'
        ? await this.prisma.customer.count({ where: { organizationId } })
        : await this.prisma.order.count({ where: { organizationId } });

    if (count >= max) {
      throw new ForbiddenException(
        `Limite piano ${org.plan} raggiunto per ${resource} (${max}). Effettua l'upgrade in Impostazioni.`,
      );
    }
  }

  private getPriceId(plan: SubscriptionPlan): string | undefined {
    const map: Partial<Record<SubscriptionPlan, string>> = {
      STARTER: this.configService.get<string>('STRIPE_PRICE_STARTER'),
      PRO: this.configService.get<string>('STRIPE_PRICE_PRO'),
    };
    return map[plan];
  }
}

function orgStripeId(session: Stripe.Checkout.Session): string | undefined {
  return typeof session.customer === 'string' ? session.customer : undefined;
}
