import '@/app/globals.css';
import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isEn = locale === 'en';

  return {
    title: {
      default: isEn ? 'ridshowcase — Personal Portfolio & App Showcase' : 'ridshowcase — Portofolio & Showcase Aplikasi',
      template: '%s | ridshowcase',
    },
    description: isEn
      ? 'Explore full-stack web applications, interactive projects, and modern digital creations built with Next.js, React, and Tailwind CSS.'
      : 'Jelajahi koleksi proyek web full-stack, aplikasi interaktif, dan karya digital modern buatan saya.',
    keywords: ['Portfolio', 'Next.js', 'React', 'Tailwind CSS', 'Web Developer', 'Full Stack', 'Showcase'],
    authors: [{ name: 'Ridwan Ariana' }],
    openGraph: {
      title: 'ridshowcase — Portfolio & Web Showcase',
      description: isEn
        ? 'Explore full-stack web applications and modern digital creations.'
        : 'Jelajahi koleksi proyek web full-stack dan karya digital modern.',
      url: 'https://ridshowcase.vercel.app',
      siteName: 'ridshowcase',
      locale: locale === 'en' ? 'en_US' : 'id_ID',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}