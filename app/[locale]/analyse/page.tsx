import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const CARD_EMOJIS = ['📐', '✨', '👁️', '📸', '💡', '🎯'] as const;
const PRIVACY_ICONS = ['🔒', '🚫', '✅'] as const;

export default function AnalysePage() {
  const t = useTranslations('analyse_page');

  const ANALYSIS_CARDS = CARD_EMOJIS.map((emoji, i) => ({
    emoji,
    title: t(`card${i + 1}_title` as Parameters<typeof t>[0]),
    desc:  t(`card${i + 1}_desc`  as Parameters<typeof t>[0]),
  }));

  const STEPS = [1, 2, 3, 4].map((n) => ({
    num:   t(`step${n}_num`   as Parameters<typeof t>[0]),
    title: t(`step${n}_title` as Parameters<typeof t>[0]),
    desc:  t(`step${n}_desc`  as Parameters<typeof t>[0]),
  }));

  const PRIVACY = PRIVACY_ICONS.map((icon, i) => ({
    icon,
    text: t(`privacy_${i + 1}` as Parameters<typeof t>[0]),
  }));

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-125 w-175 rounded-full bg-yellow-500/5 blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            {t('hero_title_1')}{' '}
            <span className="text-yellow-400">{t('hero_title_highlight')}</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t('hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/analyse/session"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors shadow-lg shadow-yellow-500/20"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              {t('start_cta')}
            </Link>
            <span className="text-xs text-zinc-500">{t('start_note')}</span>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRIVACY.map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-xl shrink-0">{icon}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-zinc-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-yellow-400/70 uppercase tracking-[0.2em] mb-3">{t('process_label')}</p>
            <h2 className="text-3xl font-bold">{t('process_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-5 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-yellow-500/20 transition-colors">
                <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 font-bold text-sm tabular-nums">
                  {num}
                </span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 py-20 border-t border-zinc-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-yellow-400/70 uppercase tracking-[0.2em] mb-3">{t('results_label')}</p>
            <h2 className="text-3xl font-bold">{t('results_title')}</h2>
            <p className="mt-3 text-zinc-400 max-w-lg mx-auto text-sm">{t('results_desc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ANALYSIS_CARDS.map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all"
              >
                <span className="text-3xl mb-4 block">{emoji}</span>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-zinc-800/60 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">{t('cta_title')}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{t('cta_desc')}</p>
          <Link
            href="/analyse/session"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors shadow-lg shadow-yellow-500/25"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
            {t('start_cta')}
          </Link>
        </div>
      </section>

    </main>
  );
}
