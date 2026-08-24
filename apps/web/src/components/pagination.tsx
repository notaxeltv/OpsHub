'use client';

import { useTranslations } from 'next-intl';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('pagination');

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{t('page', { page, total: totalPages })}</span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          {t('previous')}
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
}
