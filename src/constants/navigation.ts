// Define a type for your navigation items for strict TypeScript checking
export interface NavItem {
  label: string;
  to: string;
  roles?: string[];
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Users', to: '/dashboard/users', roles: ['admin'] },
  { label: 'Reports', to: '/dashboard/reports', roles: ['admin', 'manager'] },
];
