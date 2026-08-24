import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { TenantContext } from '../common/decorators/auth.decorators';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  listMembers(tenant: TenantContext) {
    return this.prisma.membership.findMany({
      where: { organizationId: tenant.organizationId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
