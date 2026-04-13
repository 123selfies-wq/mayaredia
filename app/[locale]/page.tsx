import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

// ─── Static data (no translation needed) ─────────────────────────────────────

const BRANDS = ['Vogue', "L'Oréal", 'Dior', 'Elle', 'Hermès', 'Chanel', 'Cartier', 'Lancôme', 'Valentino'];

const SERVICE_ICONS = [
  <svg key="s1" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  <svg key="s2" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
  <svg key="s3" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
  <svg key="s4" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>,
];

const SERVICE_STYLES = [
  { iconCls: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20', borderCls: 'hover:border-rose-500/30', tagCls: 'bg-rose-500/10 text-rose-300' },
  { iconCls: 'bg-fuchsia-500/10 text-fuchsia-400 group-hover:bg-fuchsia-500/20', borderCls: 'hover:border-fuchsia-500/30', tagCls: 'bg-fuchsia-500/10 text-fuchsia-300' },
  { iconCls: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20', borderCls: 'hover:border-amber-500/30', tagCls: 'bg-amber-500/10 text-amber-300' },
  { iconCls: 'bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20', borderCls: 'hover:border-violet-500/30', tagCls: 'bg-violet-500/10 text-violet-300' },
] as const;

const TALENTS = [
  { id: 1,  name: 'Valentina Cruz',   origin: 'Brésil',          role: 'Top Modèle',           followers: '890k', tall: true,  photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop&crop=face' },
  { id: 2,  name: 'Naledi Dlamini',   origin: 'Afrique du Sud',  role: 'Mannequin Éditorial',  followers: '420k', tall: false, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=700&fit=crop&crop=face' },
  { id: 3,  name: 'Irina Petrova',    origin: 'Russie',          role: 'Top Modèle',           followers: '1.2M', tall: true,  photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face' },
  { id: 4,  name: 'Amara Keïta',      origin: 'Sénégal',         role: 'Influenceuse',         followers: '780k', tall: false, photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=700&fit=crop&crop=face' },
  { id: 5,  name: 'Yuki Tanaka',      origin: 'Japon',           role: 'Modèle Beauté',        followers: '560k', tall: false, photo: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&h=700&fit=crop&crop=face' },
  { id: 6,  name: 'Camille Bernard',  origin: 'France',          role: 'Mannequin Couture',    followers: '340k', tall: true,  photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop&crop=face' },
  { id: 7,  name: 'Zara Okonkwo',     origin: 'Nigeria',         role: 'Top Modèle',           followers: '950k', tall: false, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=700&fit=crop&crop=face' },
  { id: 8,  name: 'Sofia Esposito',   origin: 'Italie',          role: 'Influenceuse Luxe',    followers: '1.1M', tall: true,  photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=face' },
  { id: 9,  name: 'Leila Mansouri',   origin: 'Maroc',           role: 'Hôtesse & Modèle',     followers: '290k', tall: false, photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=700&fit=crop&crop=face' },
  { id: 10, name: 'Isabella Santos',  origin: 'Brésil',          role: 'Modèle Publicité',     followers: '670k', tall: false, photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&h=700&fit=crop&crop=face' },
  { id: 11, name: 'Layla Hassan',     origin: 'Émirats',         role: 'Influenceuse Lifestyle',followers: '450k', tall: true,  photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&crop=face' },
  { id: 12, name: 'Priya Sharma',     origin: 'Inde',            role: 'Top Modèle Beauté',    followers: '830k', tall: false, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=700&fit=crop&crop=face' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();

  const STATS = [
    { value: t('stats.s1_val'), label: t('stats.s1_label') },
    { value: t('stats.s2_val'), label: t('stats.s2_label') },
    { value: t('stats.s3_val'), label: t('stats.s3_label') },
    { value: t('stats.s4_val'), label: t('stats.s4_label') },
  ];

  const SERVICES = [
    { icon: SERVICE_ICONS[0], title: t('services.s1_title'), desc: t('services.s1_desc'), tags: [t('services.s1_t1'), t('services.s1_t2'), t('services.s1_t3')], ...SERVICE_STYLES[0] },
    { icon: SERVICE_ICONS[1], title: t('services.s2_title'), desc: t('services.s2_desc'), tags: [t('services.s2_t1'), t('services.s2_t2'), t('services.s2_t3')], ...SERVICE_STYLES[1] },
    { icon: SERVICE_ICONS[2], title: t('services.s3_title'), desc: t('services.s3_desc'), tags: [t('services.s3_t1'), t('services.s3_t2'), t('services.s3_t3')], ...SERVICE_STYLES[2] },
    { icon: SERVICE_ICONS[3], title: t('services.s4_title'), desc: t('services.s4_desc'), tags: [t('services.s4_t1'), t('services.s4_t2'), t('services.s4_t3')], ...SERVICE_STYLES[3] },
  ];

  const STEPS = [
    { num: t('how.s1_num'), title: t('how.s1_title'), desc: t('how.s1_desc') },
    { num: t('how.s2_num'), title: t('how.s2_title'), desc: t('how.s2_desc') },
    { num: t('how.s3_num'), title: t('how.s3_title'), desc: t('how.s3_desc') },
  ];

  const TESTIMONIALS = [
    { quote: t('testimonials.t1_quote'), author: t('testimonials.t1_author'), role: t('testimonials.t1_role') },
    { quote: t('testimonials.t2_quote'), author: t('testimonials.t2_author'), role: t('testimonials.t2_role') },
    { quote: t('testimonials.t3_quote'), author: t('testimonials.t3_author'), role: t('testimonials.t3_role') },
  ];

  return (
    <div className="flex flex-col bg-zinc-950 text-white">

      {/* ══ HERO ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background model */}
        <Image
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&h=1000&fit=crop&crop=top"
          alt="Mayaredia hero"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/20 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/60 via-transparent to-zinc-950 pointer-events-none" />
        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-32 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 bg-rose-500" />
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-widest">
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="text-white">{t('hero.title1')}</span>
              <br />
              <span className="bg-linear-to-r from-rose-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
            </h1>

            <p className="text-zinc-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/casting"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 hover:shadow-rose-500/40"
              >
                {t('hero.cta')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/offres"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-sm transition-all hover:bg-white/5"
              >
                {t('hero.discover')}
              </Link>
            </div>

            {/* Social proof mini */}
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {TALENTS.slice(0, 5).map((t) => (
                  <div key={t.id} className="w-9 h-9 rounded-full border-2 border-zinc-950 overflow-hidden relative">
                    <Image src={t.photo} alt={t.name} fill className="object-cover" sizes="36px" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-zinc-400">{t('hero.social_proof')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BRANDS ════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/30 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-6">
            {t('brands.label')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="text-zinc-500 hover:text-zinc-200 font-semibold text-sm tracking-wider transition-colors cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-7 text-center group hover:border-rose-500/30 transition-colors"
            >
              <div className="absolute inset-0 bg-linear-to-br from-rose-500/0 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="relative text-4xl lg:text-5xl font-bold bg-linear-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent mb-1">
                {value}
              </p>
              <p className="relative text-zinc-500 text-xs uppercase tracking-widest font-medium mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-900/30 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-widest">
              {t('services.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('services.title')}</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">{t('services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICES.map(({ icon, title, desc, tags, iconCls, borderCls, tagCls }) => (
              <div
                key={title}
                className={`group relative rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${borderCls}`}
              >
                <div className={`mb-5 inline-flex p-3 rounded-xl transition-colors ${iconCls}`}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-medium ${tagCls}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-semibold uppercase tracking-widest">
              {t('how.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t('how.title')}</h2>
            <p className="text-zinc-400 max-w-md mx-auto">{t('how.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[16.6%] right-[16.6%] h-px bg-linear-to-r from-rose-500/30 via-fuchsia-500/30 to-amber-500/30" />

            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-rose-600 to-fuchsia-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-rose-600/20 mb-5 relative z-10">
                  {num}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/casting"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-rose-600 to-fuchsia-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-rose-600/20"
            >
              {t('how.apply')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TALENTS ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-900/20 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                {t('talents.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('talents.title')}</h2>
              <p className="text-zinc-400 mt-2 max-w-sm">{t('talents.subtitle')}</p>
            </div>
            <Link
              href="/offres"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 hover:border-rose-500/50 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
            >
              {t('talents.cta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Masonry-style grid via CSS columns */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {TALENTS.map((talent) => (
              <div
                key={talent.id}
                className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden cursor-pointer"
              >
                <div className={`relative w-full ${talent.tall ? 'aspect-3/4' : 'aspect-square'}`}>
                  <Image
                    src={talent.photo}
                    alt={talent.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                  {/* Followers badge top-right */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                    <span className="text-xs text-white/70 font-medium">{talent.followers}</span>
                  </div>
                  {/* Info bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <p className="text-white font-bold text-sm leading-tight">{talent.name}</p>
                    <p className="text-rose-300 text-xs mt-0.5">{talent.role}</p>
                    <p className="text-zinc-500 text-xs">{talent.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-widest">
              {t('testimonials.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('testimonials.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, author, role }) => (
              <div
                key={author}
                className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-7 hover:border-zinc-700 transition-colors"
              >
                {/* Quote mark */}
                <svg className="w-8 h-8 text-rose-500/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                <div className="border-t border-zinc-800 pt-5">
                  <p className="text-white font-semibold text-sm">{author}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-zinc-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-rose-950/50 via-zinc-950 to-fuchsia-950/30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            {t('cta.title1')}{' '}
            <span className="bg-linear-to-r from-rose-400 to-fuchsia-300 bg-clip-text text-transparent">
              {t('cta.title2')}
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/casting"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-linear-to-r from-rose-600 to-fuchsia-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-xl shadow-rose-600/25"
            >
              {t('cta.apply')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/references"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold text-sm transition-colors"
            >
              {t('cta.refs')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

