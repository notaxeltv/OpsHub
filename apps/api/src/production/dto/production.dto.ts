import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductionEntryDto {
  @IsString()
  orderId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  materialCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyCost?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class UpdateProductionEntryDto extends CreateProductionEntryDto {}
