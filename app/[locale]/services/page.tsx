import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

// Static (visual/style) data - no translation needed
const SERVICE_META = [
  {
    id: 'mannequinat',
    badgeCls: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    accent: 'from-rose-400 to-fuchsia-400',
    glow: 'bg-rose-600/10',
    borderHover: 'hover:border-rose-500/30',
    tagCls: 'bg-rose-500/10 text-rose-300',
    featureIcons: ['📸', '🎬', '👗', '📖'],
    photos: [
      { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop&crop=center', alt: 'Shooting editorial' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center', alt: 'Défilé haute couture' },
      { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&crop=center', alt: 'Campagne publicitaire' },
      { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop&crop=center', alt: 'Lookbook collection' },
    ],
  },
  {
    id: 'influence',
    badgeCls: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400',
    accent: 'from-fuchsia-400 to-violet-400',
    glow: 'bg-fuchsia-600/10',
    borderHover: 'hover:border-fuchsia-500/30',
    tagCls: 'bg-fuchsia-500/10 text-fuchsia-300',
    featureIcons: ['📱', '🎵', '▶️', '📊'],
    photos: [
      { src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=600&fit=crop&crop=center', alt: 'Influenceuse Instagram' },
      { src: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=600&fit=crop&crop=center', alt: 'Contenu TikTok' },
      { src: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&h=600&fit=crop&crop=center', alt: 'Shooting réseaux sociaux' },
      { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center', alt: 'Équipe créative digitale' },
    ],
  },
  {
    id: 'hotessariat',
    badgeCls: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    accent: 'from-amber-400 to-orange-400',
    glow: 'bg-amber-600/10',
    borderHover: 'hover:border-amber-500/30',
    tagCls: 'bg-amber-500/10 text-amber-300',
    featureIcons: ['🏛️', '🏢', '🎤', '🚗'],
    photos: [
      { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center', alt: 'Événement gala élégant' },
      { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center', alt: 'Salon professionnel' },
      { src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop&crop=center', alt: 'Conférence corporate' },
      { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center', alt: 'Réception hôtesse' },
    ],
  },
  {
    id: 'contenu',
    badgeCls: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    accent: 'from-violet-400 to-indigo-400',
    glow: 'bg-violet-600/10',
    borderHover: 'hover:border-violet-500/30',
    tagCls: 'bg-violet-500/10 text-violet-300',
    featureIcons: ['🖼️', '🎥', '✂️', '🎨'],
    photos: [
      { src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop&crop=center', alt: 'Studio photo' },
      { src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop&crop=center', alt: 'Tournage vidéo' },
      { src: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=800&h=600&fit=crop&crop=center', alt: 'Post-production' },
      { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center', alt: 'Direction artistique' },
    ],
  },
] as const;

export default function ServicesPage() {
  const t = useTranslations('services_page');

  const SERVICES = SERVICE_META.map((meta, i) => {
    const s = `s${i + 1}`;
    return {
      ...meta,
      badge: t(`${s}_badge`),
      title: t(`${s}_title`),
      subtitle: t(`${s}_subtitle`),
      description: t(`${s}_desc`),
      features: [1, 2, 3, 4].map((f) => ({
        icon: meta.featureIcons[f - 1],
        label: t(`${s}_f${f}_label`),
        desc: t(`${s}_f${f}_desc`),
      })),
      tags: [1, 2, 3, 4, 5, 6].map((j) => t(`${s}_t${j}`)),
      stats: [1, 2, 3].map((j) => ({ val: t(`${s}_stat${j}_val`), label: t(`${s}_stat${j}_label`) })),
    };
  });

  return (
    <div className="flex flex-col bg-zinc-950 text-white">

      {/* HERO */}
      <section className="relative py-28 overflow-hidden border-b border-zinc-800/60">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-fuchsia-600/8 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-8 h-0.5 bg-rose-500" />
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-widest">
              {t('hero_badge')}
            </span>
            <span className="w-8 h-0.5 bg-rose-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            <span className="text-white">{t('hero_title1')}</span>
            <br />
            <span className="bg-linear-to-r from-rose-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              {t('hero_title2')}
            </span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/casting"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30"
            >
              {t('hero_brief')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold text-sm transition-all hover:bg-zinc-900"
            >
              {t('hero_explore')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES DETAILS */}
      <div id="services" className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        {SERVICES.map((service, idx) => {
          const isReversed = idx % 2 !== 0;
          return (
            <section key={service.id} id={service.id}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
                {/* Text side */}
                <div className={isReversed ? 'lg:col-start-2' : ''}>
                  <span className={`inline-block mb-4 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-widest ${service.badgeCls}`}>
                    {service.badge}
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-bold mb-3 bg-linear-to-r ${service.accent} bg-clip-text text-transparent`}>
                    {service.title}
                  </h2>
                  <p className="text-zinc-300 font-medium mb-4">{service.subtitle}</p>
                  <p className="text-zinc-400 leading-relaxed mb-8">{service.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {service.features.map((f) => (
                      <div key={f.label} className={`rounded-xl border border-zinc-800 bg-zinc-900 p-4 ${service.borderHover} transition-colors`}>
                        <div className="text-xl mb-2">{f.icon}</div>
                        <p className="text-white font-semibold text-sm mb-1">{f.label}</p>
                        <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {service.tags.map((tag) => (
                      <span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-medium ${service.tagCls}`}>{tag}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-6">
                    {service.stats.map((s) => (
                      <div key={s.label}>
                        <p className={`text-2xl font-bold bg-linear-to-r ${service.accent} bg-clip-text text-transparent`}>{s.val}</p>
                        <p className="text-zinc-500 text-xs uppercase tracking-wider mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Photos side */}
                <div className={`relative ${isReversed ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className={`absolute inset-0 rounded-3xl ${service.glow} blur-3xl pointer-events-none scale-75`} />
                  <div className="relative grid grid-cols-2 gap-3">
                    {service.photos.map((photo, pIdx) => (
                      <div key={pIdx} className={`relative overflow-hidden rounded-2xl border border-zinc-800 ${pIdx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {idx < SERVICES.length - 1 && (
                <div className="mt-32 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
              )}
            </section>
          );
        })}
      </div>

      {/* CTA FINAL */}
      <section className="py-24 bg-zinc-900/50 border-t border-zinc-800/60">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="absolute left-1/2 -translate-x-1/2 w-96 h-40 bg-rose-600/10 blur-3xl rounded-full pointer-events-none" />
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-widest">
            {t('cta_badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('cta_title')}</h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">{t('cta_subtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/casting"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 hover:shadow-rose-500/40"
            >
              {t('cta_brief')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/offres"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold text-sm transition-all hover:bg-zinc-900/60"
            >
              {t('cta_talents')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
