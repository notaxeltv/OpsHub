import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'CRM & Contacts',
    description: 'Customer management with contacts, search, and pagination.',
  },
  {
    title: 'Orders & Margins',
    description: 'Job orders with line items, status workflow, and margin calculation.',
  },
  {
    title: 'Production Tracking',
    description: 'Log hours and materials per order with automatic inventory deduction.',
  },
  {
    title: 'Inventory',
    description: 'Stock movements, low-stock alerts, and material tracking.',
  },
  {
    title: 'Reports & Exports',
    description: 'Dashboard KPIs, CSV margin export, and PDF order reports.',
  },
  {
    title: 'Multi-tenant SaaS',
    description: 'Organizations, role-based access, org switcher, and Stripe billing.',
  },
];

const stack = [
  'Next.js 15',
  'NestJS',
  'Prisma',
  'PostgreSQL',
  'TanStack Query',
  'Tailwind + shadcn/ui',
  'Stripe',
  'Docker',
  'GitHub Actions',
];

const included = [
  'Full monorepo source code',
  'REST API with JWT auth + refresh tokens',
  'Prisma schema, migrations, and demo seed',
  'Docker Compose for local dev',
  'CI pipeline (lint, test, build)',
  'Deploy workflow (GHCR images)',
  'API e2e tests + Playwright auth test',
  'Architecture & domain documentation',
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              OH
            </div>
            <span className="text-xl font-semibold">OpsHub</span>
          </div>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">
            B2B SaaS MVP — ready to customize
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Operations hub for small businesses
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            CRM, job orders, production, inventory, margins, and reports — multi-tenant,
            production-ready codebase you can ship or white-label.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Try demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Create account</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Demo: <code className="rounded bg-muted px-1.5 py-0.5">demo@opshub.local</code> /{' '}
            <code className="rounded bg-muted px-1.5 py-0.5">password123</code>
          </p>
        </section>

        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-10 text-center text-2xl font-bold">What you get</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold">Tech stack</h2>
                <p className="mt-2 text-muted-foreground">
                  Modern TypeScript monorepo with clear separation between API and web app.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border bg-background px-3 py-1 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Included in the sale</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-primary py-16 text-primary-foreground">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold">Run it locally in minutes</h2>
            <p className="mt-4 opacity-90">
              <code className="rounded bg-primary-foreground/10 px-2 py-1">
                docker compose up --build
              </code>
              <span className="mx-2">then</span>
              <code className="rounded bg-primary-foreground/10 px-2 py-1">
                npm run prisma:seed -w @opshub/api
              </code>
            </p>
            <div className="mt-8">
              <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                <Link href="/login">Open demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>OpsHub — B2B operations SaaS MVP</p>
      </footer>
    </div>
  );
}
