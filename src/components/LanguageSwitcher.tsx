'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
      {(['en', 'id'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => router.replace(pathname, { locale: lang })}
          className={`px-3 py-1 rounded text-xs font-semibold uppercase ${
            locale === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}