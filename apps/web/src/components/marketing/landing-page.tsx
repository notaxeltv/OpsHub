'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PreferencesBar } from '@/components/preferences-bar';

const FEATURE_KEYS = ['crm', 'orders', 'production', 'inventory', 'reports', 'saas'] as const;
const STACK = ['Next.js 15', 'NestJS', 'Prisma', 'PostgreSQL', 'TanStack Query', 'Tailwind + shadcn/ui', 'Stripe', 'Docker', 'GitHub Actions'];
const INCLUDED_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7'] as const;

export function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              OH
            </div>
            <span className="text-xl font-semibold">OpsHub</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <PreferencesBar compact />
            <Button variant="ghost" asChild>
              <Link href="/login">{t('logIn')}</Link>
            </Button>
            <Button asChild>
              <Link href="/register">{t('getStarted')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 text-center sm:py-20">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">
            {t('badge')}
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t('subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">{t('tryDemo')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">{t('createAccount')}</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {t('demoHint')}{' '}
            <code className="rounded bg-muted px-1.5 py-0.5">demo@opshub.local</code> /{' '}
            <code className="rounded bg-muted px-1.5 py-0.5">password123</code>
          </p>
        </section>

        <section className="border-t bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-10 text-center text-2xl font-bold">{t('whatYouGet')}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURE_KEYS.map((key) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{t(`features.${key}.title`)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t(`features.${key}.desc`)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold">{t('techStack')}</h2>
                <p className="mt-2 text-muted-foreground">{t('techStackDesc')}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {STACK.map((item) => (
                    <span key={item} className="rounded-full border bg-background px-3 py-1 text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('included')}</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {INCLUDED_KEYS.map((key) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary">✓</span>
                      <span>{t(`includedItems.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-primary py-12 text-primary-foreground sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold">{t('runLocally')}</h2>
            <p className="mt-4 text-sm opacity-90 sm:text-base">
              <code className="block rounded bg-primary-foreground/10 px-2 py-1 sm:inline">
                docker compose up --build
              </code>
              <span className="mx-2 hidden sm:inline">then</span>
              <code className="mt-2 block rounded bg-primary-foreground/10 px-2 py-1 sm:mt-0 sm:inline">
                npm run prisma:seed -w @opshub/api
              </code>
            </p>
            <div className="mt-8">
              <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                <Link href="/login">{t('openDemo')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}
