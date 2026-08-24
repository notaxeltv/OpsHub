import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { Tenant, TenantContext } from '../common/decorators/auth.decorators';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  dashboard(@Tenant() tenant: TenantContext) {
    return this.reportsService.dashboard(tenant);
  }

  @Get('margins')
  margins(@Tenant() tenant: TenantContext) {
    return this.reportsService.marginsByOrder(tenant);
  }

  @Get('margins/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="margins.csv"')
  async exportCsv(@Tenant() tenant: TenantContext) {
    return this.reportsService.exportMarginsCsv(tenant);
  }

  @Get('orders/:id/pdf')
  async exportPdf(
    @Tenant() tenant: TenantContext,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.exportOrderPdf(tenant, id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="order-${id}.pdf"`);
    res.send(buffer);
  }
}
