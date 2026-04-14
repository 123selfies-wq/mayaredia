'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

type Status = 'idle' | 'requesting' | 'recording' | 'paused' | 'uploading' | 'done' | 'error';

export default function AnalyseSessionPage() {
  const t = useTranslations('analyse_page');

  const CONSIGNES = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10'].map(
    (k) => ({ label: t(k as Parameters<typeof t>[0]) })
  );

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
  const consignesRef = useRef(CONSIGNES);

  // Attach stream to video element when recording
  useEffect(() => {
    if ((status === 'recording' || status === 'paused') && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [status]);

  const uploadAnalysis = useCallback((blob: Blob) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

    const formData = new FormData();
    formData.append('file', blob, 'analyse-morphologie.webm');
    formData.append('upload_preset', preset);
    formData.append('folder', 'analyses');
    formData.append('tags', 'analyse,morphologie,ia');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
    xhr.onload = () => {
      if (xhr.status === 200) {
        setStatus('done');
      } else {
        setStatus('done'); // show done even on upload error
        console.error('Upload error:', xhr.status);
      }
    };
    xhr.onerror = () => {
      setStatus('done');
      console.error('Upload network error');
    };
    xhr.send(formData);
  }, []);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg(t('s_cam_unavailable'));
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

      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 500_000,
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        setStatus('uploading');
        uploadAnalysis(new Blob(chunksRef.current, { type: mimeTypeRef.current }));
      };

      recorder.start(1000);
      setStatus('recording');

      timerRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
    } catch {
      setErrorMsg(t('s_cam_denied'));
      setStatus('error');
    }
  }, [uploadAnalysis, t]);

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
      stopRecording();
    } else {
      const next = consigneIndexRef.current + 1;
      consigneIndexRef.current = next;
      setConsigneIndex(next);
    }
  }, [stopRecording]);

  const consignes = consignesRef.current;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">

        {/* IDLE */}
        {status === 'idle' && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-8 space-y-7">
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-yellow-500/10 text-yellow-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div>
                <h1 className="text-lg font-bold text-white">{t('s_title')}</h1>
                <p className="text-xs text-zinc-500">{t('s_consigne_count', { count: consignes.length })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <svg className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-yellow-400/80">{t('s_camera_tip')}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{t('s_before_start')}</p>
              <ul className="space-y-2">
                {[t('s_prep_1'), t('s_prep_2'), t('s_prep_3'), t('s_prep_4')].map((item, i) => (
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
              {t('s_start')}
            </button>
          </div>
        )}

        {/* REQUESTING */}
        {status === 'requesting' && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-16 flex flex-col items-center gap-5">
            <div className="w-12 h-12 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin" />
            <p className="text-sm text-zinc-400">{t('s_cam_requesting')}</p>
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
                    <span className="text-xs font-bold text-white tracking-widest">ANALYSE</span>
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
                  <p className="text-white text-2xl font-bold">{t('s_pause_title')}</p>
                  <p className="text-sm text-zinc-400">
                    {t('s_pause_auto')}{' '}
                    <span className="text-amber-400 font-semibold tabular-nums">{formatTime(180 - pauseElapsed)}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-yellow-400/70 uppercase tracking-[0.2em]">
                    {t('s_consigne_label', { current: consigneIndex + 1, total: consignes.length })}
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
                  {t('s_btn_resume')}
                </button>
              ) : consigneIndex >= consignes.length - 1 ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('s_btn_finish')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    {t('s_btn_next')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={pauseRecording}
                    className="px-5 py-3.5 rounded-xl border border-amber-500/40 text-amber-400 text-sm font-medium hover:bg-amber-500/10 transition-colors"
                  >
                    {t('s_btn_pause')}
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-5 py-3.5 rounded-xl border border-red-900/40 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
                  >
                    {t('s_btn_stop')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* UPLOADING */}
        {status === 'uploading' && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-16 flex flex-col items-center gap-5 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin" />
            <p className="text-white font-semibold">{t('s_uploading_title')}</p>
            <p className="text-sm text-zinc-400">{t('s_uploading_desc')}</p>
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
            <h2 className="text-xl font-bold text-white">{t('s_done_title')}</h2>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">{t('s_done_desc')}</p>
            <button
              type="button"
              onClick={() => { setStatus('idle'); setConsigneIndex(0); consigneIndexRef.current = 0; setElapsed(0); }}
              className="mt-2 px-6 py-2.5 rounded-full border border-yellow-500/40 text-yellow-400 text-sm font-medium hover:bg-yellow-500/10 transition-colors"
            >
              {t('s_btn_redo')}
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
                <p className="text-sm font-semibold text-red-400">{t('s_error_title')}</p>
                <p className="text-xs text-zinc-500 mt-1">{errorMsg}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setStatus('idle'); setErrorMsg(''); }}
              className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-yellow-500/40 hover:text-yellow-400 transition-colors"
            >
              {t('s_btn_retry')}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
