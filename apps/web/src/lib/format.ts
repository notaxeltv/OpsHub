export function formatCurrency(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('it-IT').format(new Date(value));
}
