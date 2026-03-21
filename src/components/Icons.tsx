import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
}

const defaultProps: React.SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const createIcon = (name: string, paths: React.ReactNode) => {
  const Icon = ({ size = 24, ...props }: IconProps) => (
    <svg {...defaultProps} width={size} height={size} {...props}>
      {paths}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
};

export const Twitter = createIcon('Twitter', (
  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
));

export const Discord = createIcon('Discord', (
  <>
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <path d="M7.5 7.1c2.7-1.1 6.3-1.1 9 0 .5-.5 1.5-1.4 1.5-1.4a11 11 0 0 0-3.5-1.2l-.3.7c-1.4-.2-2.9-.2-4.3 0l-.3-.7a11 11 0 0 0-3.6 1.2s1 1 1.5 1.4z" />
    <path d="M16 18c-1-.2-2.1-.5-3-.9l-.3-.12M8 18c1-.2 2.1-.5 3-.9l.3-.12" />
    <path d="M12 14.5c-1.5 0-3-.5-4-1.5l-.5-.5c.5-.5 1-1.5 1-2.5h11c0 1-.5 2-1 2.5l-.5.5c-1 1-2.5 1.5-4 1.5z" />
  </>
));

export const Github = createIcon('Github', (
  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
));

export const Menu = createIcon('Menu', (
  <>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </>
));

export const X = createIcon('X', (
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>
));

export const LayoutDashboard = createIcon('LayoutDashboard', (
  <>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </>
));

export const Wallet = createIcon('Wallet', (
  <>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </>
));

export const ArrowLeftRight = createIcon('ArrowLeftRight', (
  <>
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </>
));

export const Store = createIcon('Store', (
  <>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </>
));

export const Settings = createIcon('Settings', (
  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
));

export const ShieldAlert = createIcon('ShieldAlert', (
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </>
));

export const Cpu = createIcon('Cpu', (
  <>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M15 2v2" />
    <path d="M15 20v2" />
    <path d="M2 15h2" />
    <path d="M2 9h2" />
    <path d="M20 15h2" />
    <path d="M20 9h2" />
    <path d="M9 2v2" />
    <path d="M9 20v2" />
  </>
));

export const Sparkles = createIcon('Sparkles', (
  <>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M3 5h4" />
    <path d="M21 17v4" />
    <path d="M19 19h4" />
  </>
));

export const LogOut = createIcon('LogOut', (
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </>
));

export const Bell = createIcon('Bell', (
  <>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </>
));

export const Search = createIcon('Search', (
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
));

export const ChevronDown = createIcon('ChevronDown', (
  <path d="m6 9 6 6 6-6" />
));

export const CheckCircle2 = createIcon('CheckCircle2', (
  <>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </>
));

export const AlertTriangle = createIcon('AlertTriangle', (
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>
));

export const XCircle = createIcon('XCircle', (
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </>
));

export const TrendingUp = createIcon('TrendingUp', (
  <>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </>
));

export const Lightbulb = createIcon('Lightbulb', (
  <>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </>
));

export const Copy = createIcon('Copy', (
  <>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </>
));

export const RefreshCw = createIcon('RefreshCw', (
  <>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </>
));

export const Clock = createIcon('Clock', (
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
));

export const Zap = createIcon('Zap', (
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
));

export const Bot = createIcon('Bot', (
  <>
    <path d="M12 2V5" />
    <path d="M6 7V20A2 2 0 0 0 8 22H16A2 2 0 0 0 18 20V7" />
    <path d="M2 13H4" />
    <path d="M20 13H22" />
    <rect x="9" y="11" width="6" height="4" rx="1" />
  </>
));

export const Send = createIcon('Send', (
  <>
    <line x1="22" x2="11" y1="2" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </>
));

export const Loader2 = createIcon('Loader2', (
  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
));

export const EyeOff = createIcon('EyeOff', (
  <>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </>
));

export const FileText = createIcon('FileText', (
  <>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </>
));

export const ArrowUpRight = createIcon('ArrowUpRight', (
  <>
    <line x1="7" x2="17" y1="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </>
));

export const ChevronRight = createIcon('ChevronRight', (
  <path d="m9 18 6-6-6-6" />
));

export const Gavel = createIcon('Gavel', (
  <>
    <path d="m14 13-2-2" />
    <path d="m16 15-2-2-5-5 2-2 5 5 2 2-2 2Z" />
    <path d="m2 21 6-6" />
    <path d="M15 13a1 1 0 0 1 1 1v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a1 1 0 0 1 1-1h6Z" />
  </>
));

export const FileCheck = createIcon('FileCheck', (
  <>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m9 15 2 2 4-4" />
  </>
));

export const AtSign = createIcon('AtSign', (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
  </>
));

export const Lock = createIcon('Lock', (
  <>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>
));

export const Eye = createIcon('Eye', (
  <>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>
));

export const Filter = createIcon('Filter', (
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
));

export const Bitcoin = createIcon('Bitcoin', (
  <>
    <path d="M11.767 19.089v-3.113c.857 0 1.697-.072 2.52-.215a3.892 3.892 0 0 0 2.822-2.144c.516-1.126.46-2.4-.157-3.483a3.747 3.747 0 0 0-2.292-1.892l.006-.003a3.51 3.51 0 0 0 1.911-1.611c.41-.857.37-1.844-.11-2.673a3.385 3.385 0 0 0-2.492-1.638c-.69-.072-1.385-.099-2.08-.08V2.337l-1.557.016V5.03c-.68 0-1.353-.016-2.02-.016V2.353l-1.557.016v2.624H3.5l.032 1.557c.603.016 1.207.032 1.81.032.22 0 .445-.016.66-.032l-.032 9.792c-.215-.016-.44-.032-.66-.032-.603 0-1.207.016-1.81.032l-.032 1.557h5.387v2.701l1.557-.016v-2.712c.667 0 1.34-.016 2.02-.016v2.712l1.557-.016v-3.077c-.126 0-.251.016-.377.016zm0-12.413c.795 0 1.582.025 2.373.069.604.032 1.027.532 1.102 1.132.075.604-.26 1.135-.85 1.343-1.132.39-2.3.435-3.46.435l.016-3.006c.273.016.541.027.819.027zm-.032 4.452c1.397 0 2.793.033 4.19.08.6.022 1.026.526 1.1 1.132.075.605-.26 1.135-.85 1.343-1.657.572-3.41.636-5.15.636l.01-3.23c.23.016.464.03.7.03z" />
  </>
));

export const ReceiptText = createIcon('ReceiptText', (
  <>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M14 8H8" />
    <path d="M16 12H8" />
    <path d="M13 16H8" />
  </>
));

export const User = createIcon('User', (
  <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
));

export const Shield = createIcon('Shield', (
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
));

export const Gift = createIcon('Gift', (
  <>
    <rect x="3" y="8" width="18" height="4" />
    <path d="M12 8v14" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </>
));

export const Check = createIcon('Check', (
  <polyline points="20 6 9 17 4 12" />
));

export const MapPin = createIcon('MapPin', (
  <>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </>
));

export const Activity = createIcon('Activity', (
  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
));

export const Download = createIcon('Download', (
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </>
));

export const Plus = createIcon('Plus', (
  <>
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="5" x2="19" y1="12" y2="12" />
  </>
));

export const Minus = createIcon('Minus', (
  <line x1="5" x2="19" y1="12" y2="12" />
));

export const ArrowRight = createIcon('ArrowRight', (
  <>
    <line x1="5" x2="19" y1="12" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </>
));

export const ShoppingBag = createIcon('ShoppingBag', (
  <>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </>
));

export const ExternalLink = createIcon('ExternalLink', (
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </>
));

export const History = createIcon('History', (
  <>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </>
));

export const Fingerprint = createIcon('Fingerprint', (
  <>
    <path d="M2 12a10 10 0 0 1 18-6" />
    <path d="M5 8a7 7 0 0 1 12 0" />
    <path d="M8 10a4 4 0 0 1 8 0" />
    <path d="M12 12v4" />
    <path d="M8 16a4 4 0 0 1 8 0" />
    <path d="M5 20a10 10 0 0 1 14-4" />
  </>
));

export const Terminal = createIcon('Terminal', (
  <>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </>
));

export const CreditCard = createIcon('CreditCard', (
  <>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </>
));

export const Key = createIcon('Key', (
  <>
    <path d="m21 2-2 2-2-2-2 2-2-2-3 3a4 4 0 1 0 5 5l1.5-1.5L20 10l1.5-1.5L20 7l1.5-1.5L22 4Z" />
    <circle cx="7.5" cy="15.5" r="1.5" />
  </>
));

export const Smartphone = createIcon('Smartphone', (
  <>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </>
));

export const ShieldCheck = createIcon('ShieldCheck', (
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </>
));

export const Globe = createIcon('Globe', (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </>
));

export const BarChart2 = createIcon('BarChart2', (
  <>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </>
));
