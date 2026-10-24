import { db } from '@/db';
import { projects } from '@/db/schema';
import { ilike, or, sql } from 'drizzle-orm';
import SearchBar from '@/components/SearchBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { ArrowDown, Code2, Database, Sparkles } from 'lucide-react';

export default async function HomePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: 'en' | 'id' }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { q, page } = await searchParams;
  const t = await getTranslations();

  const query = q || '';
  const currentPage = Number(page) || 1;
  const itemsPerPage = 6;
  const offset = (currentPage - 1) * itemsPerPage;

  const whereCondition = query
    ? or(
        ilike(projects.title, `%${query}%`),
        sql`exists (select 1 from unnest(${projects.techStack}) elem where elem ilike ${`%${query}%`})`
      )
    : undefined;

  const [dataList, countResult] = await Promise.all([
    db.select().from(projects).where(whereCondition).limit(itemsPerPage).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(projects).where(whereCondition)
  ]);

  const totalItems = Number(countResult[0]?.count || 0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <header className="w-full max-w-6xl flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">ridshowcase</span>
          </div>
          <LanguageSwitcher />
        </header>

        <div className="w-full max-w-3xl text-center space-y-6 my-auto z-10 px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {t('Hero.badge')}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {t('Hero.title')}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            {t('Hero.subtitle')}
          </p>

          <div className="pt-4">
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 z-10 text-slate-500 text-xs animate-bounce cursor-pointer pb-4">
          <span>{t('Hero.scrollDown')}</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </section>

      {/* --- CATALOG CONTENT SECTION --- */}
      <section id="projects-section" className="max-w-6xl mx-auto px-4 py-16 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('Catalog.title')}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {query ? t('Catalog.subSearch', { query }) : t('Catalog.subAll')}
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {t('Catalog.count', { count: totalItems })}
          </span>
        </div>

        {/* Grid 3x3 */}
        {dataList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataList.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {locale === 'en' ? item.shortDescEn : item.shortDescId}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate max-w-[150px]">{item.techStack.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item.databaseUsed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/project/${item.slug}`}
                    className="block w-full text-center bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-medium text-xs py-2.5 rounded-xl transition-all duration-200"
                  >
                    {t('Card.viewDetails')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900 border border-slate-800/80 rounded-2xl text-slate-400 text-sm">
            {t('Catalog.empty')}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8">
            {currentPage > 1 && (
              <Link
                href={`/?q=${query}&page=${currentPage - 1}`}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-white rounded-xl transition"
              >
                {t('Pagination.previous')}
              </Link>
            )}
            <span className="text-xs text-slate-400">
              {t('Pagination.page')} {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/?q=${query}&page=${currentPage + 1}`}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-white rounded-xl transition"
              >
                {t('Pagination.next')}
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}