import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    COMPLETED: 'bg-green-100 text-green-700',
    INVOICED: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={cn('rounded-full px-2 py-1 text-xs font-medium', colors[status] ?? 'bg-gray-100')}>
      {status.replace('_', ' ')}
    </span>
  );
}
