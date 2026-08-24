import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('members')
  listMembers(@Tenant() tenant: TenantContext) {
    return this.usersService.listMembers(tenant);
  }
}
