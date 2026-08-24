import { toNumber, roundCurrency } from '../utils/numbers';

export interface OrderItemInput {
  quantity: number | { toNumber?: () => number };
  unitPrice: number | { toNumber?: () => number };
}

export interface ProductionEntryInput {
  hours: number | { toNumber?: () => number };
  materialCost: number | { toNumber?: () => number };
  hourlyCost?: number | { toNumber?: () => number } | null;
}

export interface OrderMarginInput {
  items: OrderItemInput[];
  productionEntries: ProductionEntryInput[];
  hourlyRate: number | { toNumber?: () => number };
  externalCosts: number | { toNumber?: () => number };
  defaultHourlyRate?: number;
}

export interface OrderMarginResult {
  revenue: number;
  laborCost: number;
  materialCost: number;
  externalCosts: number;
  totalCost: number;
  margin: number;
  marginPercent: number;
}

export function calculateOrderMargin(input: OrderMarginInput): OrderMarginResult {
  const revenue = roundCurrency(
    input.items.reduce((sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitPrice), 0),
  );

  const fallbackRate = input.defaultHourlyRate ?? toNumber(input.hourlyRate);
  const effectiveHourlyRate = toNumber(input.hourlyRate) || fallbackRate;

  let laborCost = 0;
  let materialCost = 0;

  for (const entry of input.productionEntries) {
    const rate = entry.hourlyCost != null ? toNumber(entry.hourlyCost) : effectiveHourlyRate;
    laborCost += toNumber(entry.hours) * rate;
    materialCost += toNumber(entry.materialCost);
  }

  laborCost = roundCurrency(laborCost);
  materialCost = roundCurrency(materialCost);
  const externalCosts = roundCurrency(toNumber(input.externalCosts));
  const totalCost = roundCurrency(laborCost + materialCost + externalCosts);
  const margin = roundCurrency(revenue - totalCost);
  const marginPercent = revenue > 0 ? roundCurrency((margin / revenue) * 100) : 0;

  return {
    revenue,
    laborCost,
    materialCost,
    externalCosts,
    totalCost,
    margin,
    marginPercent,
  };
}
