import { UsersRound ,Settings,LineChart,File,MapPin,Tags, Home,Waves,Folders} from 'lucide-react';
import { FaGlobe, FaMobileAlt, FaUsers, FaTags } from 'react-icons/fa';

export const navItems = [
 {  id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
 },
  
  {
    id:"customers",
    name:"customers",
    icon:UsersRound,
    links: [
      { href: '/customers', label: 'Customers' },
      // { href: '/clients', label: 'Clients' },
      // { href: '/partners', label: 'Partners' },
      // { href: '/admins', label: 'Admins' },
    ],
  },
  {
    id:"sites",
    name:"Site Management",
    href: '/sites',
    icon:MapPin,
    
  },
  {
    id:"water-atm",
    name:"WaterATM Management",
    href: '/water-atm',
    icon:Waves,
    
  },
  {
    id:"tags",
    name:"Tag Management",
    href: '/tags',
    icon:Tags,
    
  },
  {
    id:"reports",
    name:"reports",
    icon:Folders,
    links: [
      { href: '/transaction', label: 'Transaction Reports' },
      // { href: '/consumption', label: 'Consumption Reports' },
      // { href: '/revenue', label: 'Revenue Reports' },
    ],
  },

  // {
  //   id:"analytics",
  //   name:"Analytics",
  //   href: '/analytics',
  //   icon:LineChart,
    
  // },
  
  {
    id:"settings",
    name:"settings",
    icon:Settings,
    links: [
      { href: '/account', label: 'Account' },
      // { href: '/business', label: 'Business' },
      // { href: '/content', label: 'Content' },
      // { href: '/version', label: 'Version' },
      // { href: '/system', label: 'System' },
    ],
  },
 
  
];


export const cards = [
  { id: 1, name: 'Sites', stats: '50', icon: FaGlobe, description:"2% increase " },
  { id: 2, name: 'Devices', stats: '100', icon: FaMobileAlt,description:"25% increase " },
  { id: 3, name: 'Clients', stats: '75', icon: FaUsers ,description:"2% increase "},
  { id: 4, name: 'Tags', stats: '16', icon: FaTags ,description:"1% increase "},
];
 export const users = [
  { name: 'Liam Johnson', status: 'Paid', amount: 'Kes 250.00' },
  { name: 'Olivia Smith', status: 'Pending', amount:'Kes 1500.00' },
  { name: 'Noah Williams', status: 'Paid', amount: 'Kes 900' },
  { name: 'Emma Brown', status: 'Failed', amount: 'Kes 45000' },
  // Add more user data as needed
];
