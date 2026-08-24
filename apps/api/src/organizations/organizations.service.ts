import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MembershipRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';
import { UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findOne(tenant: TenantContext) {
    const org = await this.prisma.organization.findFirst({
      where: { id: tenant.organizationId },
      include: {
        memberships: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(tenant: TenantContext, dto: UpdateOrganizationDto) {
    this.assertAdmin(tenant.role);
    const { settings, ...rest } = dto;
    return this.prisma.organization.update({
      where: { id: tenant.organizationId },
      data: {
        ...rest,
        ...(settings !== undefined ? { settings: settings as object } : {}),
      },
    });
  }

  private assertAdmin(role: MembershipRole) {
    if (role !== MembershipRole.OWNER && role !== MembershipRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
  }
}
