export const navItems = [
  {
    title: 'Dashboard',
    links: [
      { href: '/dashboard', },
    ],
  },
  {
    title: 'User Management',
    dropdownName: 'users',
    key: 'user-management',
    links: [
      { href: '/users/customers', label: 'Customers' },
      { href: '/users/clients', label: 'Clients' },
      { href: '/users/partners', label: 'Partners' },
      { href: '/users/admins', label: 'Admins' },
    ],
  },
  {
    title: 'Site Management',
    dropdownName: 'site-management',
    key: 'site-management',
    links: [
      { href: '/sites', label: 'Sites' },
    ],
  },
  {
    title: 'Water ATM Management',
    dropdownName: 'water-atm-management',
    key: 'water-atm-management',
    links: [
      { href: '/water-atm', label: 'Water ATMs' },
    ],
  },
  {
    title: 'Tag Management',
    dropdownName: 'tags',
    key: 'tag-management',
    links: [
      { href: '/tags', label: 'Tags' },
    ],
  },
  {
    title: 'Settings',
    dropdownName: 'settings',
    key: 'settings',
    links: [
      { href: '/account', label: 'Account Settings' },
      { href: '/business', label: 'Business Settings' },
      { href: '/version', label: 'Version Settings' },
      { href: '/content', label: 'Content Settings' },
      { href: '/system', label: 'System Settings' },
    ],
  },
  {
    title: 'Transaction Reports',
    dropdownName: 'transactions',
    key: 'transaction-reports',
    links: [
      { href: '/mpesa-tranasction', label: 'Mpesa Transactions' },
      { href: '/card-transactions', label: 'Card Transactions' },
      { href: '/consumption-transactions', label: 'Consumption Tranactions' },
    ],
  },
  {
    title: 'Consumption Reports',
    dropdownName: 'consumption',
    key: 'consumption-reports',
    links: [
      { href: '/mpesa-consumption', label: ' Genereate Mpesa Consumption' },
      { href: '/card-consumption', label: 'Generate Card Consumptions' },
    ],
  },
  {
    title: 'Revenue Reports',
    dropdownName: 'revenue',
    key: 'revenue-reports',
    links: [
      { href: '/mpesa-report', label: 'Mpesa Pay Transactions' },
      { href: '/card-report', label: 'Cardpay transactions' },
    ],
  },
];
