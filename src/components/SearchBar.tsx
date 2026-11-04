'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const t = useTranslations('Search');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set('q', term);
    else params.delete('q');
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    const target = document.getElementById('projects-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto shadow-lg dark:shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10 rounded-2xl">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
      <input
        type="text"
        placeholder={t('placeholder')}
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-md transition text-sm md:text-base"
      />
    </div>
  );
}