'use client';

import { useAuth } from '@/components/auth-provider';

export function OrganizationSwitcher() {
  const { organizations, currentOrgId, switchOrganization } = useAuth();

  if (organizations.length <= 1) {
    const org = organizations[0];
    return org ? (
      <span className="text-sm font-medium text-muted-foreground">{org.name}</span>
    ) : null;
  }

  return (
    <select
      className="rounded-md border bg-background px-3 py-1.5 text-sm"
      value={currentOrgId ?? ''}
      onChange={(e) => switchOrganization(e.target.value)}
    >
      {organizations.map((org) => (
        <option key={org.id} value={org.id}>{org.name}</option>
      ))}
    </select>
  );
}
