import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

// Static visual/style data
const CATEGORIES_META = [
  {
    id: 'modeles',
    colorCls: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    accentFrom: 'from-rose-400',
    accentTo: 'to-fuchsia-400',
    offres: [
      { id: 'vetements', urgent: false, photo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-rose-500/10 text-rose-300', borderHover: 'hover:border-rose-500/30', tkPrefix: 'man_vet', nReqs: 3, nTags: 4 },
      { id: 'lingerie', urgent: true, photo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop&crop=top', tagCls: 'bg-rose-500/10 text-rose-300', borderHover: 'hover:border-rose-500/30', tkPrefix: 'man_ling', nReqs: 3, nTags: 4 },
      { id: 'web', urgent: false, photo: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-rose-500/10 text-rose-300', borderHover: 'hover:border-rose-500/30', tkPrefix: 'man_web', nReqs: 3, nTags: 4 },
      { id: 'social', urgent: true, photo: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-rose-500/10 text-rose-300', borderHover: 'hover:border-rose-500/30', tkPrefix: 'man_soc', nReqs: 3, nTags: 4 },
    ],
  },
  {
    id: 'hotesses',
    colorCls: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    accentFrom: 'from-amber-400',
    accentTo: 'to-orange-400',
    offres: [
      { id: 'salon', urgent: false, photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-amber-500/10 text-amber-300', borderHover: 'hover:border-amber-500/30', tkPrefix: 'hot_sal', nReqs: 3, nTags: 4 },
      { id: 'gala', urgent: true, photo: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-amber-500/10 text-amber-300', borderHover: 'hover:border-amber-500/30', tkPrefix: 'hot_gal', nReqs: 3, nTags: 4 },
      { id: 'corporate', urgent: false, photo: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-amber-500/10 text-amber-300', borderHover: 'hover:border-amber-500/30', tkPrefix: 'hot_corp', nReqs: 3, nTags: 4 },
    ],
  },
  {
    id: 'influenceuses',
    colorCls: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400',
    accentFrom: 'from-fuchsia-400',
    accentTo: 'to-violet-400',
    offres: [
      { id: 'placement', urgent: false, photo: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-fuchsia-500/10 text-fuchsia-300', borderHover: 'hover:border-fuchsia-500/30', tkPrefix: 'inf_plac', nReqs: 3, nTags: 4 },
      { id: 'ambassadrice', urgent: true, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=400&fit=crop&crop=face', tagCls: 'bg-fuchsia-500/10 text-fuchsia-300', borderHover: 'hover:border-fuchsia-500/30', tkPrefix: 'inf_amb', nReqs: 3, nTags: 4 },
      { id: 'ugc', urgent: false, photo: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-fuchsia-500/10 text-fuchsia-300', borderHover: 'hover:border-fuchsia-500/30', tkPrefix: 'inf_ugc', nReqs: 3, nTags: 4 },
      { id: 'live', urgent: true, photo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop&crop=center', tagCls: 'bg-fuchsia-500/10 text-fuchsia-300', borderHover: 'hover:border-fuchsia-500/30', tkPrefix: 'inf_live', nReqs: 3, nTags: 4 },
    ],
  },
] as const;

type OffreCardProps = {
  photo: string;
  urgent: boolean;
  subtitle: string;
  title: string;
  desc: string;
  requirements: string[];
  tags: string[];
  tagCls: string;
  borderHover: string;
  applyLabel: string;
  urgentLabel: string;
};

function OffreCard({ photo, urgent, subtitle, title, desc, requirements, tags, tagCls, borderHover, applyLabel, urgentLabel }: OffreCardProps) {
  return (
    <div className={`group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 ${borderHover}`}>
      <div className="relative h-48 overflow-hidden">
        <Image src={photo} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
        {urgent && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg animate-pulse">
            {urgentLabel}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{subtitle}</p>
        <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">{desc}</p>
        <ul className="space-y-1.5 mb-5">
          {requirements.map((req) => (
            <li key={req} className="flex items-start gap-2 text-zinc-400 text-xs">
              <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {req}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags.map((tag) => (
            <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagCls}`}>{tag}</span>
          ))}
        </div>
        <div className="border-t border-zinc-800 pt-4 mt-auto">
          <Link href="/casting" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-md shadow-rose-600/20 hover:shadow-rose-500/30">
            {applyLabel}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OffresPage() {
  const t = useTranslations('offres_page');

  const CATEGORIES = CATEGORIES_META.map((cat, catIdx) => {
    const catKeys = ['cat_models', 'cat_hostesses', 'cat_influencers'] as const;
    return {
      ...cat,
      label: t(catKeys[catIdx]),
      offres: cat.offres.map((o) => ({
        ...o,
        title: t(`${o.tkPrefix}_title`),
        subtitle: t(`${o.tkPrefix}_subtitle`),
        desc: t(`${o.tkPrefix}_desc`),
        requirements: Array.from({ length: o.nReqs }, (_, i) => t(`${o.tkPrefix}_req${i + 1}`)),
        tags: Array.from({ length: o.nTags }, (_, i) => t(`${o.tkPrefix}_t${i + 1}`)),
      })),
    };
  });

  const totalOffers = CATEGORIES.reduce((acc, c) => acc + c.offres.length, 0);
  const totalUrgent = CATEGORIES.reduce((acc, c) => acc + c.offres.filter((o) => o.urgent).length, 0);

  return (
    <div className="flex flex-col bg-zinc-950 text-white">

      {/* HERO */}
      <section className="relative py-24 overflow-hidden border-b border-zinc-800/60">
        <div className="absolute top-0 left-1/3 w-96 h-80 rounded-full bg-rose-600/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-60 rounded-full bg-fuchsia-600/8 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-8 h-0.5 bg-rose-500" />
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-widest">
              {t('hero_badge')}
            </span>
            <span className="w-8 h-0.5 bg-rose-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            {t('hero_title')}
            <br />
            <span className="bg-linear-to-r from-rose-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              {t('hero_highlight')}
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {totalOffers} {t('hero_badge').toLowerCase()}
            </span>
            <span className="text-zinc-700">·</span>
            <span>{totalUrgent} {t('urgent_badge').toLowerCase()}</span>
            <span className="text-zinc-700">·</span>
            <span>{t('update_label')}</span>
          </div>
        </div>
      </section>

      {/* OFFRES PAR CATÉGORIE */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${cat.colorCls}`}>
                  {cat.label}
                </span>
                <span className="text-zinc-600 text-sm">{cat.offres.length} {t('hero_badge').toLowerCase()}</span>
              </div>
              <div className={`h-px flex-1 mx-4 bg-linear-to-r ${cat.accentFrom} ${cat.accentTo} opacity-20 hidden sm:block`} />
              <Link href="/casting" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5">
                {t('casting_link')}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cat.offres.map((offre) => (
                <OffreCard
                  key={offre.id}
                  photo={offre.photo}
                  urgent={offre.urgent}
                  subtitle={offre.subtitle}
                  title={offre.title}
                  desc={offre.desc}
                  requirements={offre.requirements}
                  tags={offre.tags}
                  tagCls={offre.tagCls}
                  borderHover={offre.borderHover}
                  applyLabel={t('apply_btn')}
                  urgentLabel={t('urgent_badge')}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA FINAL */}
      <section className="py-20 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('footer_title')}</h2>
          <p className="text-zinc-400 leading-relaxed mb-8">{t('footer_subtitle')}</p>
          <Link href="/casting" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30">
            {t('footer_btn')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
