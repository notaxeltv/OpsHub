'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  it: 'IT',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
};

export function PreferencesBar({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('preferences');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function switchLocale(next: Locale) {
    router.replace(pathname, { locale: next });
  }

  if (!mounted) {
    return <div className={compact ? 'h-8 w-24' : 'h-9 w-40'} />;
  }

  return (
    <div className={`flex items-center gap-2 ${compact ? 'flex-wrap' : ''}`}>
      <label className="sr-only">{t('language')}</label>
      <select
        aria-label={t('language')}
        className="h-8 rounded-md border bg-background px-2 text-xs sm:text-sm"
        value={locale}
        onChange={(e) => switchLocale(e.target.value as Locale)}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>{LOCALE_LABELS[l]}</option>
        ))}
      </select>

      <div className="flex rounded-md border p-0.5" role="group" aria-label={t('theme')}>
        <Button
          type="button"
          variant={theme === 'light' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 w-7 px-0"
          onClick={() => setTheme('light')}
          title={t('light')}
        >
          <Sun className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={theme === 'dark' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 w-7 px-0"
          onClick={() => setTheme('dark')}
          title={t('dark')}
        >
          <Moon className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={theme === 'system' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 w-7 px-0"
          onClick={() => setTheme('system')}
          title={t('system')}
        >
          <Monitor className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
