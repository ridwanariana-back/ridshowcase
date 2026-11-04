import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import WhatsAppButton from '@/components/WhatsAppButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ locale: 'en' | 'id'; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();

  const [project] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);

  if (!project) notFound();

  // Masukkan nomor WA kamu di sini (format tanpa '+' atau '0')
  const MY_PHONE_NUMBER = '628123456789'; 
  const currentAppUrl = `https://ridshowcase.vercel.app/${locale}/project/${project.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 transition-colors duration-300">
      <div className="space-y-8 max-w-4xl mx-auto pb-24">
        
        {/* Header Navigation, Theme Toggle, & Language Switcher */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('Detail.back')}</span>
          </Link>

          {/* Controls: Switch Theme & Language */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Gambar Full Aspect Ratio */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-2 shadow-xl dark:shadow-2xl">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* Title & Long Description */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {project.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {locale === 'en' ? project.longDescEn : project.longDescId}
          </p>
        </div>

        {/* Tech Stack & Database Specs Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md dark:shadow-lg">
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('Detail.techStack')}
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('Detail.database')}
            </h3>
            <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold mt-3">
              {project.databaseUsed || '-'}
            </p>
          </div>
        </div>

        {/* CTA Buttons (Live Demo & Contact Me) */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            {t('Detail.liveDemo')}
          </a>

          <WhatsAppButton
            phoneNumber={MY_PHONE_NUMBER}
            itemName={project.title}
            itemUrl={currentAppUrl}
            label={t('Detail.contactMe')}
          />
        </div>
      </div>
    </div>
  );
}