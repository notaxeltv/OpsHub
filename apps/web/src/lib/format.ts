export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('en-US').format(new Date(value));
}
