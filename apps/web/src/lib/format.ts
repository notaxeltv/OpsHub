const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  it: 'it-IT',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
};

export function formatCurrency(value: number, locale = 'en') {
  const intlLocale = LOCALE_MAP[locale] ?? 'en-US';
  return new Intl.NumberFormat(intlLocale, { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatDate(value: string | Date, locale = 'en') {
  const intlLocale = LOCALE_MAP[locale] ?? 'en-US';
  return new Intl.DateTimeFormat(intlLocale).format(new Date(value));
}
