'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { CastingType, CandidateInfo } from './CastingForm';

type Consigne = { label: string };

const CONSIGNES: Consigne[] = [
  { label: "Présentez-vous : prénom, âge, ville" },
  { label: "Parlez-nous de ce que vous faites dans la vie et de vos expériences" },
  { label: "Qu’est-ce que vous souhaitez faire ?" },
  { label: "Souriez et regardez la caméra" },
  { label: "Mettez-vous debout face à la caméra" },
  { label: "Tournez-vous doucement vers la gauche, puis vers la droite" },
  { label: "Marchez lentement vers la caméra naturellement" },
  { label: "Faites un aller-retour complet, dos à la caméra puis retour face" },
  { label: "Prenez une pose naturelle debout, mains sur les hanches" },
  { label: "Prenez une pose de face, mains sur les hanches" },
  { label: "Prenez une pose, une main dans les cheveux" },
  { label: "Si vous souhaitez, vous pouvez mettre pause et changer de tenue et reprendre" },
  { label: "Reprendre des poses ou terminer le casting" },
];

const PREP_CONSIGNES: Record<CastingType, string[]> = {
  modele: [
    "Prévoyez des poses variées : debout de face, de profil, en mouvement naturel, mains sur les hanches",
  ],
  influenceuse: [
    "Prévoyez différentes expressions et poses naturelles face caméra pour montrer votre polyvalence",
  ],
  hotesse: [
    "Préparez une tenue professionnelle soignée : robe de cocktail, tailleur ou ensemble élégant",
    "Adoptez une posture droite, port de tête assuré — attitude professionnelle et souriante",
  ],
  lingerie: [],
  glamour: [
    "Prévoyez différentes poses expressives : debout de face, de profil, regard caméra avec assurance",
  ],
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

type Status = 'idle' | 'requesting' | 'recording' | 'paused' | 'uploading' | 'done' | 'error';

export default function CastingVideo({ castingTypes, candidateInfo }: { castingTypes: CastingType[]; candidateInfo: CandidateInfo | null }) {
  const [status, setStatus] = useState<Status>('idle');
  const [consigneIndex, setConsigneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [pauseElapsed, setPauseElapsed] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef('video/webm');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const consigneIndexRef = useRef(0);
  const consignesRef = useRef<Consigne[]>(CONSIGNES);

  // Attach camera stream to hidden video element once recording UI is rendered
  useEffect(() => {
    if ((status === 'recording' || status === 'paused') && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [status]);

  const uploadVideo = useCallback((blob: Blob) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

    const formData = new FormData();
    formData.append('file', blob, 'casting-video.webm');
    formData.append('upload_preset', preset);
    formData.append('folder', 'casting');

    if (candidateInfo) {
      const context = [
        `prenom=${candidateInfo.prenom || ''}`,
        `nom=${candidateInfo.nom || ''}`,
        `age=${String(candidateInfo.age || '')}`,
        `ville=${candidateInfo.ville || ''}`,
        `email=${candidateInfo.email || ''}`,
        `telephone=${candidateInfo.telephone || ''}`,
        `instagram=${candidateInfo.instagram || ''}`,
        `tiktok=${candidateInfo.tiktok || ''}`,
        `youtube=${candidateInfo.youtube || ''}`,
        `types=${candidateInfo.types.join(',')}`,
      ].join('|');
      const tags = ['casting', ...candidateInfo.types, ...(candidateInfo.ville ? [candidateInfo.ville] : [])].join(',');
      formData.append('context', context);
      formData.append('tags', tags);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('Upload OK');
      } else {
        console.error('Upload error:', xhr.status, xhr.responseText);
      }
    };
    xhr.onerror = () => console.error('Upload network error');

    xhr.send(formData);
  }, [candidateInfo]);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("La caméra n'est pas disponible. Ouvrez la page via http://localhost:3000 ou en HTTPS.");
      setStatus('error');
      return;
    }

    setStatus('requesting');
    setErrorMsg('');
    setConsigneIndex(0);
    consigneIndexRef.current = 0;
    setElapsed(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;

      const mimeType =
        ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
          .find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
      mimeTypeRef.current = mimeType || 'video/webm';

      const videoBitrate = 500_000; // 500 kbps — keeps 10-min videos under 50 MB
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: videoBitrate,
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        uploadVideo(new Blob(chunksRef.current, { type: mimeTypeRef.current }));
        setStatus('done');
      };

      recorder.start(1000);
      setStatus('recording');

      timerRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
    } catch {
      setErrorMsg('Accès à la caméra refusé ou indisponible.');
      setStatus('error');
    }
  }, [uploadVideo]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop();
    if (pauseTimerRef.current) { clearInterval(pauseTimerRef.current); pauseTimerRef.current = null; }
  }, []);

  const pauseRecording = useCallback(() => {
    setStatus('paused');
    setPauseElapsed(0);
    pauseTimerRef.current = setInterval(() => {
      setPauseElapsed((prev) => {
        if (prev >= 179) {
          // Auto-resume after 3 minutes
          if (pauseTimerRef.current) { clearInterval(pauseTimerRef.current); pauseTimerRef.current = null; }
          setStatus('recording');
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  }, []);

  const resumeRecording = useCallback(() => {
    if (pauseTimerRef.current) { clearInterval(pauseTimerRef.current); pauseTimerRef.current = null; }
    setPauseElapsed(0);
    setStatus('recording');
  }, []);

  const handleNext = useCallback(() => {
    const consignes = consignesRef.current;
    if (consigneIndexRef.current >= consignes.length - 1) {
      if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop();
    } else {
      const next = consigneIndexRef.current + 1;
      consigneIndexRef.current = next;
      setConsigneIndex(next);
    }
  }, []);

  const consignes = CONSIGNES;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">

      {/* IDLE */}
      {status === 'idle' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-8 space-y-7">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-yellow-500/10 text-yellow-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Casting vidéo</h2>
              <p className="text-xs text-zinc-500">{consignes.length} consignes à réaliser</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <svg className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-yellow-400/80">
              Les consignes s&apos;afficheront une par une à l&apos;écran. Autorisez l&apos;accès à la caméra et au micro lorsque le navigateur le demande.
            </p>
          </div>

          {/* Preparation checklist */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Avant de commencer</p>
            <ul className="space-y-2">
              {[
                "Placez-vous bien en face de la caméra, dans un endroit éclairé",
                "Vous pouvez arrêter, mettre en pause ou annuler à tout moment et reprendre quand vous êtes prêt(e)",
                "Préparez des tenues variées selon votre recherche : robes, tenue casual, tenue de sport, maillot de bain, lingerie…",
                ...castingTypes.flatMap((t) => PREP_CONSIGNES[t]),
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="mt-0.5 shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={startRecording}
            className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
            Commencer le casting
          </button>
        </div>
      )}

      {/* REQUESTING */}
      {status === 'requesting' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-16 flex flex-col items-center gap-5">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin" />
          <p className="text-sm text-zinc-400">Accès à la caméra en cours…</p>
        </div>
      )}

      {/* RECORDING / PAUSED */}
      {(status === 'recording' || status === 'paused') && (
        <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex flex-col" style={{ minHeight: '480px' }}>
          {/* PiP camera */}
          <div className="absolute bottom-20 right-4 w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden border border-zinc-700 bg-black shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/80">
            <div className="flex items-center gap-2">
              {status === 'paused' ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-amber-400 tracking-widest">PAUSE</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-widest">REC</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {consignes.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === consigneIndex
                      ? 'w-4 h-2.5 bg-yellow-400'
                      : i < consigneIndex
                      ? 'w-2.5 h-2.5 bg-yellow-700'
                      : 'w-2.5 h-2.5 bg-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-500 tabular-nums">{formatTime(elapsed)}</span>
          </div>

          {/* Instruction / Pause overlay */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center gap-4">
            {status === 'paused' ? (
              <>
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 text-amber-400 mb-2">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                </span>
                <p className="text-white text-2xl font-bold">Casting en pause</p>
                <p className="text-sm text-zinc-400">Temps restant : <span className="text-amber-400 font-semibold tabular-nums">{formatTime(180 - pauseElapsed)}</span></p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-yellow-400/70 uppercase tracking-[0.2em]">
                  Consigne {consigneIndex + 1} / {consignes.length}
                </p>
                <p className="text-white text-2xl sm:text-3xl font-bold leading-snug max-w-md">
                  {consignes[consigneIndex].label}
                </p>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3 px-5 py-4 border-t border-zinc-800/60 bg-zinc-900/80">
            {status === 'paused' ? (
              <button
                type="button"
                onClick={resumeRecording}
                className="flex-1 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Reprendre
              </button>
            ) : consigneIndex >= consignes.length - 1 ? (
              <>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Terminer
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 py-3.5 rounded-xl border border-yellow-500/50 text-yellow-400 text-sm font-bold hover:bg-yellow-500/10 transition-colors flex items-center justify-center gap-2"
                >
                  Envoyer la candidature
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  Consigne suivante
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={pauseRecording}
                  className="px-5 py-3.5 rounded-xl border border-amber-500/40 text-amber-400 text-sm font-medium hover:bg-amber-500/10 transition-colors"
                >
                  Pause
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-5 py-3.5 rounded-xl border border-red-900/40 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
                >
                  Arrêter
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* DONE */}
      {status === 'done' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => { setStatus('idle'); setConsigneIndex(0); setElapsed(0); }}
            className="mt-2 px-6 py-2.5 rounded-full border border-yellow-500/40 text-yellow-400 text-sm font-medium hover:bg-yellow-500/10 transition-colors"
          >
            Refaire le casting
          </button>
        </div>
      )}

      {/* ERROR */}
      {status === 'error' && (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8 space-y-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-400">Une erreur est survenue</p>
              <p className="text-xs text-zinc-500 mt-1">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setStatus('idle'); setErrorMsg(''); }}
            className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-yellow-500/40 hover:text-yellow-400 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

    </div>
  );
}
