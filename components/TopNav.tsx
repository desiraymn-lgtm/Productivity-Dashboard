'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Today' },
  { href: '/daily', label: 'Daily Tracker' },
  { href: '/books', label: 'Books' },
  { href: '/five-year-plan', label: '5-Year Plan' },
  { href: '/vision-board', label: 'Vision Board' },
  { href: '/goals', label: 'Goals' },
  { href: '/travel', label: 'Travel' },
  { href: '/tiktok', label: 'TikTok Plan' },
  { href: '/business', label: 'Business' },
  { href: '/budget', label: 'Budget' },
  { href: '/rewards', label: 'Rewards' },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <span className="topnav-brand">The Ledger</span>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`topnav-link${pathname === link.href ? ' is-active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
