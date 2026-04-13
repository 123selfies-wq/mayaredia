import { useTranslations } from 'next-intl';

export default function BlogPage() {
  const t = useTranslations('blog_page');
  return (
    <main className="flex flex-col flex-1 items-center justify-center gap-3 bg-zinc-950 text-white py-20 px-6 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold">{t('title')}</h1>
      <p className="text-zinc-400">{t('subtitle')}</p>
      <p className="text-zinc-600 text-sm">{t('coming_soon')}</p>
    </main>
  );
}
