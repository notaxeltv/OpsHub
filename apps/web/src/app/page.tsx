import type { Metadata } from 'next';
import { LandingPage } from '@/components/marketing/landing-page';

export const metadata: Metadata = {
  title: 'OpsHub — B2B Operations SaaS for Small Businesses',
  description:
    'Multi-tenant CRM, job orders, production, inventory, margins, and reports. Full-stack MVP built with Next.js, NestJS, and Prisma.',
  openGraph: {
    title: 'OpsHub — B2B Operations SaaS MVP',
    description:
      'CRM, orders, production, inventory, and margin reporting for small businesses. Production-ready codebase.',
    type: 'website',
  },
};

export default function HomePage() {
  return <LandingPage />;
}
