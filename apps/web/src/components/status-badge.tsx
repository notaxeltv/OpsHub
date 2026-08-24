'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  INVOICED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('status');
  const label = ['DRAFT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'INVOICED'].includes(status)
    ? t(status as 'DRAFT')
    : status.replace('_', ' ');

  return (
    <span className={cn('inline-block rounded-full px-2 py-1 text-xs font-medium', COLORS[status] ?? 'bg-gray-100 dark:bg-gray-800')}>
      {label}
    </span>
  );
}
