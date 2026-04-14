'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import CastingForm, { type CastingType, type CandidateInfo } from './CastingForm';
import CastingVideo from './CastingVideo';

type Step = 'mode' | 'video-type' | 'video-info' | 'video-record' | 'image-form';

const VIDEO_TYPE_KEYS: { value: CastingType; emoji: string; plus18: boolean }[] = [
  { value: 'modele',       emoji: '👗', plus18: false },
  { value: 'influenceuse', emoji: '✨',  plus18: false },
  { value: 'hotesse',      emoji: '🎤', plus18: false },
  { value: 'lingerie',     emoji: '🌸', plus18: true  },
  { value: 'glamour',      emoji: '💋', plus18: true  },
];

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}

export default function CastingClient() {
  const t = useTranslations('casting_page');
  const [step, setStep] = useState<Step>('mode');
  const [videoTypes, setVideoTypes] = useState<CastingType[]>(['modele']);
  const [pendingTypes, setPendingTypes] = useState<CastingType[]>(['modele']);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);

  const VIDEO_TYPES = VIDEO_TYPE_KEYS.map((item) => ({
    ...item,
    label: t(`type_${item.value}_label` as Parameters<typeof t>[0]),
    hint:  t(`type_${item.value}_hint`  as Parameters<typeof t>[0]),
  }));

  const hasPendingPlus18 = VIDEO_TYPES.some((c) => pendingTypes.includes(c.value) && c.plus18);

  const confirmVideoType = () => {
    if (pendingTypes.length === 0) return;
    if (hasPendingPlus18 && !ageConfirmed) {
      setAgeError(true);
      return;
    }
    setVideoTypes(pendingTypes);
    setStep('video-info');
  };

  /* ---- STEP: mode selection ---- */
  if (step === 'mode') {
    return (
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Casting Vidéo — recommended */}
          <button
            type="button"
            onClick={() => setStep('video-type')}
            className="relative flex flex-col items-start gap-4 p-7 rounded-2xl border border-zinc-700 bg-zinc-900/60 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all text-left group"
          >
            <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
              {t('recommended')}
            </span>
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 text-2xl">
              🎬
            </span>
            <div>
              <h3 className="text-lg font-bold text-white mb-1.5">{t('video_title')}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t('video_desc')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-400 group-hover:translate-x-1 transition-transform">
              {t('start')}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>

          {/* Casting Photo */}
          <button
            type="button"
            onClick={() => setStep('image-form')}
            className="flex flex-col items-start gap-4 p-7 rounded-2xl border border-zinc-700 bg-zinc-900/60 hover:border-zinc-500/60 transition-all text-left group"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800 text-2xl">
              📸
            </span>
            <div>
              <h3 className="text-lg font-bold text-white mb-1.5">{t('photo_title')}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t('photo_desc')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all">
              {t('start')}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </section>
    );
  }

  /* ---- STEP: image form ---- */
  if (step === 'image-form') {
    return (
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <BackButton onClick={() => setStep('mode')} label={t('back')} />
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 sm:p-10">
          <CastingForm submitLabel={t('submit_photo')} />
        </div>
      </section>
    );
  }

  /* ---- STEP: video type selection ---- */
  if (step === 'video-type') {
    return (
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <BackButton onClick={() => setStep('mode')} label={t('back')} />
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 sm:p-10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{t('offers_question')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VIDEO_TYPES.map(({ value, emoji, label, hint, plus18 }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setPendingTypes((prev) =>
                    prev.includes(value)
                      ? prev.filter((t) => t !== value)
                      : [...prev, value]
                  );
                  setAgeConfirmed(false);
                  setAgeError(false);
                }}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left ${
                  pendingTypes.includes(value)
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-sm font-semibold text-white flex-1">{label}</span>
                  {plus18 && (
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      +18
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 pl-7">{hint}</span>
              </button>
            ))}
          </div>

          {hasPendingPlus18 && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => {
                    setAgeConfirmed(e.target.checked);
                    setAgeError(false);
                  }}
                  className="mt-0.5 h-4 w-4 rounded accent-yellow-500 shrink-0"
                />
                <span className="text-sm text-amber-200/80 leading-relaxed">
                  {t('age_confirm')}
                </span>
              </label>
              {ageError && (
                <p className="mt-2 text-xs text-red-400 pl-7">
                  {t('age_error')}
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={confirmVideoType}
            className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
          >
            {t('continue_form')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    );
  }

  /* ---- STEP: info form ---- */
  if (step === 'video-info') {
    return (
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <BackButton onClick={() => setStep('video-type')} label={t('back')} />
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">{t('info_title')}</h2>
          <p className="text-sm text-zinc-400">
            {t('info_subtitle')}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 sm:p-10">
          <CastingForm
            hideSections={['type', 'photos']}
            onSubmitWithData={(info) => {
              setCandidateInfo({ ...info, types: videoTypes });
              setStep('video-record');
            }}
          />
        </div>
      </section>
    );
  }

  /* ---- STEP: video recording ---- */
  return (
    <section className="max-w-2xl mx-auto px-6 pb-24">
      <BackButton
        onClick={() => setStep('video-info')}
        label={t('back')}
      />
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <CastingVideo castingTypes={videoTypes} candidateInfo={candidateInfo} />
      </div>
    </section>
  );
}
