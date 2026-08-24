import { calculateOrderMargin, OrderMarginInput } from './margin.service';

describe('calculateOrderMargin', () => {
  const baseInput: OrderMarginInput = {
    items: [{ quantity: 2, unitPrice: 100 }],
    productionEntries: [],
    hourlyRate: 50,
    externalCosts: 0,
  };

  it('calculates revenue from order items', () => {
    const result = calculateOrderMargin(baseInput);
    expect(result.revenue).toBe(200);
    expect(result.margin).toBe(200);
    expect(result.marginPercent).toBe(100);
  });

  it('subtracts labor and material costs', () => {
    const result = calculateOrderMargin({
      ...baseInput,
      productionEntries: [
        { hours: 4, materialCost: 30, hourlyCost: null },
        { hours: 2, materialCost: 20, hourlyCost: 40 },
      ],
      externalCosts: 10,
    });

    expect(result.laborCost).toBe(280); // 4*50 + 2*40
    expect(result.materialCost).toBe(50);
    expect(result.externalCosts).toBe(10);
    expect(result.totalCost).toBe(340);
    expect(result.margin).toBe(-140);
    expect(result.marginPercent).toBe(-70);
  });

  it('uses default hourly rate when order rate is zero', () => {
    const result = calculateOrderMargin({
      ...baseInput,
      hourlyRate: 0,
      defaultHourlyRate: 35,
      productionEntries: [{ hours: 2, materialCost: 0 }],
    });

    expect(result.laborCost).toBe(70);
  });
});
