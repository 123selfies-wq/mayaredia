'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

const NAV_HREFS = ['/', '/services', '/offres', '/casting'] as const;
const NAV_KEYS = ['home', 'services', 'offres', 'casting'] as const;

const LOCALES = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'ar', flag: '🇸🇦', label: 'AR' },
] as const;

type Locale = (typeof LOCALES)[number]['code'];

export default function Navbar() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('nav');

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const NAV_LINKS = NAV_HREFS.map((href, i) => ({ href, label: t(NAV_KEYS[i]) }));

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" locale={locale} className="font-bold text-xl tracking-tight text-gray-900">
          Mayaredia
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                locale={locale}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: language switcher + mobile burger */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <select
            value={locale}
            onChange={(e) => router.replace(pathname, { locale: e.target.value as Locale })}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Switch language"
          >
            {LOCALES.map(({ code, flag, label }) => (
              <option key={code} value={code}>
                {flag} {label}
              </option>
            ))}
          </select>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <ul className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  locale={locale}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
