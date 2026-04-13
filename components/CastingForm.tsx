'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { CldUploadWidget } from 'next-cloudinary';

export type CastingType = 'modele' | 'influenceuse' | 'hotesse' | 'lingerie' | 'glamour';

const TYPE_CARDS: { value: CastingType; emoji: string; label: string; plus18?: boolean }[] = [
  { value: 'modele',       emoji: '👗', label: 'Modèle' },
  { value: 'influenceuse', emoji: '✨', label: 'Influenceuse' },
  { value: 'hotesse',      emoji: '🎤', label: 'Hôtesse' },
  { value: 'lingerie',     emoji: '🌸', label: 'Maillots / Lingerie', plus18: true },
  { value: 'glamour',      emoji: '💋', label: 'Modèle Glamour', plus18: true },
];

type FormData = {
  nom: string;
  prenom: string;
  age: number;
  ville: string;
  email: string;
  telephone: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  youtube: string;
};

export type CandidateInfo = {
  prenom: string;
  nom: string;
  age: number | string;
  ville: string;
  email: string;
  telephone: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  types: CastingType[];
};

type UploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: 'image' | 'video';
};

const INPUT_BASE =
  'w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors';
const LABEL_BASE = 'block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5';
const ERROR_BASE = 'mt-1 text-xs text-red-400';

type Props = {
  onTypeSelect?: (type: CastingType) => void;
  hideSections?: ('type' | 'photos')[];
  onSubmitWithData?: (info: CandidateInfo) => void;
  submitLabel?: string;
};

export default function CastingForm({ onTypeSelect, hideSections, onSubmitWithData, submitLabel }: Props) {
  const t = useTranslations('form');
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<CastingType[]>([]);

  const toggleType = (value: CastingType) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const isPlus18Type = selectedTypes.some((t) => t === 'lingerie' || t === 'glamour');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ defaultValues: { instagram: '', tiktok: '', facebook: '', youtube: '' } });

  const formValues = watch();

  const cloudinaryContext: Record<string, string> = {
    prenom: formValues.prenom || '',
    nom: formValues.nom || '',
    age: String(formValues.age || ''),
    ville: formValues.ville || '',
    email: formValues.email || '',
    telephone: formValues.telephone || '',
    instagram: formValues.instagram || '',
    tiktok: formValues.tiktok || '',
    youtube: formValues.youtube || '',
    types: selectedTypes.join(','),
  };

  const cloudinaryTags = ['casting', ...selectedTypes, ...(formValues.ville ? [formValues.ville] : [])];

  useEffect(() => {
    if (selectedTypes.length > 0) onTypeSelect?.(selectedTypes[0]);
  }, [selectedTypes, onTypeSelect]);

  const onSubmit = async (data: FormData) => {
    if (isPlus18Type && !ageConfirmed) return;
    const candidateInfo: CandidateInfo = {
      prenom: data.prenom,
      nom: data.nom,
      age: data.age,
      ville: data.ville,
      email: data.email,
      telephone: data.telephone,
      instagram: data.instagram,
      tiktok: data.tiktok,
      youtube: data.youtube,
      types: selectedTypes,
    };
    reset();
    setAgeConfirmed(false);
    setUploads([]);
    setSelectedTypes([]);
    if (onSubmitWithData) {
      onSubmitWithData(candidateInfo);
    } else {
      setSubmitted(true);
    }
  };

  const handleUpload = (result: unknown) => {
    const r = result as { info: UploadResult };
    if (r?.info?.secure_url) {
      setUploads((prev) => [...prev, r.info]);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-400 mb-2">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">{t('success_title')}</h3>
        <p className="text-zinc-400 max-w-sm">
          {t('success_subtitle')}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 rounded-full border border-yellow-500/40 text-yellow-400 text-sm font-medium hover:bg-yellow-500/10 transition-colors"
        >
          {t('new_application')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

      {/* Identity */}
      <div>
        <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-5 pb-2 border-b border-zinc-800">
          {t('section_identity')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={LABEL_BASE}>{t('firstName')}</label>
            <input
              {...register('prenom')}
              placeholder={t('firstName_placeholder')}
              className={INPUT_BASE}
            />
            {errors.prenom && <p className={ERROR_BASE}>{errors.prenom.message}</p>}
          </div>
          <div>
            <label className={LABEL_BASE}>{t('lastName')}</label>
            <input
              {...register('nom')}
              placeholder={t('lastName_placeholder')}
              className={INPUT_BASE}
            />
            {errors.nom && <p className={ERROR_BASE}>{errors.nom.message}</p>}
          </div>
          <div>
            <label className={LABEL_BASE}>{t('age')}</label>
            <input
              type="number"
              min={16}
              max={60}
              {...register('age', {
                min: { value: 16, message: t('age_min') },
                max: { value: 60, message: t('age_max') },
              })}
              placeholder={t('age_placeholder')}
              className={INPUT_BASE}
            />
            {errors.age && <p className={ERROR_BASE}>{errors.age.message}</p>}
          </div>
          <div>
            <label className={LABEL_BASE}>{t('city')}</label>
            <input
              {...register('ville')}
              placeholder={t('city_placeholder')}
              className={INPUT_BASE}
            />
            {errors.ville && <p className={ERROR_BASE}>{errors.ville.message}</p>}
          </div>
          <div>
            <label className={LABEL_BASE}>{t('email')}</label>
            <input
              type="email"
              {...register('email', {
                pattern: { value: /^\S+@\S+\.\S+$/, message: t('email_invalid') },
              })}
              placeholder="votre@email.com"
              className={INPUT_BASE}
            />
            {errors.email && <p className={ERROR_BASE}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={LABEL_BASE}>{t('phone')}</label>
            <input
              type="tel"
              {...register('telephone', {
                pattern: { value: /^[+\d][\d\s\-().]{7,}$/, message: t('phone_invalid') },
              })}
              placeholder="+33 6 00 00 00 00"
              className={INPUT_BASE}
            />
            {errors.telephone && <p className={ERROR_BASE}>{errors.telephone.message}</p>}
          </div>
        </div>
      </div>

      {/* Profile type */}
      {!hideSections?.includes('type') && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-5 pb-2 border-b border-zinc-800">
            {t('section_profile')}
          </h3>
          <label className={LABEL_BASE}>{t('profile_type')}</label>
          <div className="grid grid-cols-2 gap-3">
            {TYPE_CARDS.map(({ value, emoji, label, plus18 }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleType(value)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTypes.includes(value)
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {plus18 && (
                  <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">+18</span>
                )}
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold text-zinc-300 text-center">{label}</span>
              </button>
            ))}
          </div>

          {isPlus18Type && (
            <div className="mt-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-yellow-500 cursor-pointer shrink-0"
                />
                <span className="text-sm text-amber-200/80 leading-relaxed">
                  Je certifie avoir <strong>18 ans ou plus</strong> et j&apos;accepte de participer à ce type de casting en toute connaissance de cause.
                </span>
              </label>
              {!ageConfirmed && (
                <p className="mt-2 text-xs text-red-400 pl-7">
                  Vous devez confirmer votre majorité pour continuer.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Social media */}
      <div>
        <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-5 pb-2 border-b border-zinc-800">
          {t('section_social')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { key: 'instagram' as const, label: 'Instagram', placeholder: '@votre_pseudo' },
            { key: 'tiktok' as const, label: 'TikTok', placeholder: '@votre_pseudo' },
            { key: 'facebook' as const, label: 'Facebook', placeholder: 'votre.page' },
            { key: 'youtube' as const, label: 'YouTube', placeholder: '@votre_chaine' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={LABEL_BASE}>{label}</label>
              <input
                {...register(key)}
                placeholder={placeholder}
                className={INPUT_BASE}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Media uploads */}
      {!hideSections?.includes('photos') && <div>
        <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-5 pb-2 border-b border-zinc-800">
          {t('section_photos')}
        </h3>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'ml_default'}
          options={{
            sources: ['local', 'camera'],
            multiple: true,
            maxFiles: 5,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'],
            maxFileSize: 50_000_000,
            context: cloudinaryContext,
            tags: cloudinaryTags,
            styles: { palette: { window: '#18181b', tabIcon: '#eab308', link: '#eab308', action: '#eab308', sourceBg: '#27272a' } },
          }}
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-zinc-700 hover:border-yellow-500/60 hover:bg-yellow-500/5 transition-all cursor-pointer"
            >
              <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm text-zinc-400">
                {t('upload_cta')}
              </span>
              <span className="text-xs text-zinc-600">{t('upload_hint')}</span>
            </button>
          )}
        </CldUploadWidget>

        {uploads.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {uploads.map((u, i) => (
              <li key={i} className="relative rounded-lg overflow-hidden aspect-square bg-zinc-800">
                {u.resource_type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.secure_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-400 text-xs p-2 text-center">
                    <span>🎥 {t('video_uploaded')}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setUploads((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || (isPlus18Type && !ageConfirmed)}
        className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm tracking-wide transition-colors shadow-lg shadow-yellow-500/20"
      >
        {isSubmitting ? t('submitting') : (submitLabel ?? t('submit'))}
      </button>
    </form>
  );
}
