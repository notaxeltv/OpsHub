import { PLAN_LIMITS } from './plan-limits';

describe('PLAN_LIMITS', () => {
  it('FREE plan has customer and order limits', () => {
    expect(PLAN_LIMITS.FREE.maxCustomers).toBe(10);
    expect(PLAN_LIMITS.FREE.maxOrders).toBe(20);
    expect(PLAN_LIMITS.FREE.inventoryEnabled).toBe(false);
  });

  it('PRO plan has no limits', () => {
    expect(PLAN_LIMITS.PRO.maxCustomers).toBeNull();
    expect(PLAN_LIMITS.PRO.maxOrders).toBeNull();
    expect(PLAN_LIMITS.PRO.inventoryEnabled).toBe(true);
  });
});
