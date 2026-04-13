import { Link } from '@/i18n/navigation';

const ANALYSIS_CARDS = [
  {
    emoji: '📐',
    title: 'Morphologie & silhouette',
    desc: 'Proportions, ratio taille/hanches, longueur du cou et des membres — tout est mesuré avec précision.',
  },
  {
    emoji: '✨',
    title: 'Style naturel',
    desc: 'Identification de votre registre dominant : classique, éditorial, sportswear, glamour ou commercial.',
  },
  {
    emoji: '👁️',
    title: 'Présence caméra & regard',
    desc: 'Intensité du regard, aisance devant l\'objectif, facteur de charisme naturel.',
  },
  {
    emoji: '📸',
    title: 'Type de shooting recommandé',
    desc: 'Mode, publicité, beauté, lingerie, hôtesse — l\'analyse vous oriente vers les catégories les plus adaptées.',
  },
  {
    emoji: '💡',
    title: 'Points forts & axes de progression',
    desc: 'Vos atouts physiques et comportementaux, avec des recommandations concrètes.',
  },
  {
    emoji: '🎯',
    title: 'Castings compatibles',
    desc: 'Les annonces Mayaredia qui correspondent à votre profil généré par l\'analyse.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Activez votre caméra',
    desc: 'Autorisez l\'accès à votre webcam. Aucune installation, tout fonctionne dans le navigateur.',
  },
  {
    num: '02',
    title: 'Suivez les consignes à l\'écran',
    desc: 'Poses de face, de profil, en mouvement — chaque étape est guidée une par une.',
  },
  {
    num: '03',
    title: 'L\'IA analyse votre morphologie',
    desc: 'Le modèle traite votre silhouette, votre posture et votre présence en temps réel.',
  },
  {
    num: '04',
    title: 'Génération de votre fiche modèle',
    desc: 'Un rapport complet avec votre profil, vos points forts et les castings recommandés.',
  },
];

export default function AnalysePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-125 w-175 rounded-full bg-yellow-500/5 blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Votre fiche modèle générée{' '}
            <span className="text-yellow-400">par intelligence artificielle</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Notre IA analyse votre morphologie, votre silhouette et votre présence caméra pour construire
            une fiche modèle fidèle à votre potentiel réel — en quelques minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/analyse/session"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors shadow-lg shadow-yellow-500/20"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              Démarrer mon analyse
            </Link>
            <span className="text-xs text-zinc-500">Gratuit · Aucun compte requis · 3 min</span>
          </div>
        </div>
      </section>

      {/* ── Confidentialité ─────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🔒', text: 'Analyse effectuée localement — aucune vidéo transmise à nos serveurs' },
            { icon: '🚫', text: 'Rien n\'est stocké sur nos infrastructures sans votre accord explicite' },
            { icon: '✅', text: 'Données traitées en temps réel et supprimées à la fin de la session' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-xl shrink-0">{icon}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ───────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-zinc-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-yellow-400/70 uppercase tracking-[0.2em] mb-3">Processus</p>
            <h2 className="text-3xl font-bold">Comment fonctionne l&apos;analyse ?</h2>
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

      {/* ── Ce que la fiche contient ────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-zinc-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-yellow-400/70 uppercase tracking-[0.2em] mb-3">Résultats</p>
            <h2 className="text-3xl font-bold">Votre fiche modèle comprend</h2>
            <p className="mt-3 text-zinc-400 max-w-lg mx-auto text-sm">
              Chaque dimension est analysée et synthétisée dans un rapport personnalisé.
            </p>
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

      {/* ── CTA final ───────────────────────────────────────────────────── */}
      <section className="px-6 py-24 border-t border-zinc-800/60 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Prête à découvrir votre potentiel&nbsp;?</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            L&apos;analyse est gratuite, instantanée et 100&nbsp;% confidentielle. Aucun compte requis.
          </p>
          <Link
            href="/analyse/session"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors shadow-lg shadow-yellow-500/25"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
            Démarrer mon analyse
          </Link>
        </div>
      </section>

    </main>
  );
}
