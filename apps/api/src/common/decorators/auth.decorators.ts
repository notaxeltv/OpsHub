import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { MembershipRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedUser extends JwtPayload {
  userId: string;
}

export interface TenantContext {
  user: AuthenticatedUser;
  organizationId: string;
  role: MembershipRole;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);

export const Tenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantContext => {
    const request = ctx.switchToHttp().getRequest<{ tenant: TenantContext }>();
    return request.tenant;
  },
);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: MembershipRole[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const NO_TENANT_KEY = 'noTenant';
export const NoTenant = () => SetMetadata(NO_TENANT_KEY, true);

export const ORGANIZATION_HEADER = 'x-organization-id';
