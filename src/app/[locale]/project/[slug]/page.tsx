import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import WhatsAppButton from '@/components/WhatsAppButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

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
  const MY_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'; 
  const currentAppUrl = `https://ridshowcase.vercel.app/${locale}/project/${project.slug}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="space-y-8 max-w-4xl mx-auto pb-24">
        {/* Header Navigation & Language Switcher */}
<div className="flex justify-between items-center pb-4 border-b border-slate-800">
  <Link
    href="/"
    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition shadow-sm"
  >
    <span>&larr;</span>
    <span>{t('Detail.back')}</span>
  </Link>

  <LanguageSwitcher />
</div>

        {/* Gambar Full Aspect Ratio (Tidak Kepotong) */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-2 shadow-2xl">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* Title & Long Description */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {locale === 'en' ? project.longDescEn : project.longDescId}
          </p>
        </div>

        {/* Tech Stack & Database Specs Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Detail.techStack')}
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-slate-800 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Detail.database')}
            </h3>
            <p className="text-slate-200 text-sm font-semibold mt-3">
              {project.databaseUsed || '-'}
            </p>
          </div>
        </div>

        {/* CTA Buttons (Live Demo & Contact Me) */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
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