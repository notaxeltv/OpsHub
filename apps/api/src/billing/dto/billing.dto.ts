import { IsEnum } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class CreateCheckoutDto {
  @IsEnum(SubscriptionPlan)
  plan!: SubscriptionPlan;
}
