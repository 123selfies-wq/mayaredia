import { useTranslations } from 'next-intl';
import CastingClient from '@/components/CastingClient';

export default function CastingPage() {
  const t = useTranslations('casting_page');
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-yellow-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold uppercase tracking-widest">
            {t('badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <CastingClient />
    </div>
  );
}

