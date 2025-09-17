import React, { useEffect, useMemo, useRef, useState } from 'react';
import Lottie from 'lottie-react';

import loadingAnimationData from '../assets/animations/loading-portal.json';

const STATUS_STEPS = [
  { limit: 18, message: 'Spinam siatki kwantowe...' },
  { limit: 38, message: 'Podnosze dynamike renderu...' },
  { limit: 62, message: 'Harmonizuje neonowe gradienty...' },
  { limit: 84, message: 'Stabilizuje sciezki ruchu...' },
  { limit: 100, message: 'Lacze sie ze scena glowna...' },
  { limit: Infinity, message: 'Media Narrative jest gotowe.' },
];

const HEADLINE_WORDS = ['PASJA', 'FORMA', 'EFEKT'];
const HEADLINE_INTERVAL = 900;

const LoadingScreen = ({ onComplete, duration = 2600 }) => {
  const [phase, setPhase] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const rafRef = useRef(null);
  const outroTimeoutRef = useRef(null);
  const completedRef = useRef(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setPhase('active'));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    completedRef.current = false;

    const easeInOut = (value) => {
      if (value < 0.5) {
        return 4 * value * value * value;
      }

      const inverse = -2 * value + 2;
      return 1 - (inverse * inverse * inverse) / 2;
    };

    const start = performance.now();

    const finish = () => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;
      setProgress(100);
      setPhase('outro');

      outroTimeoutRef.current = window.setTimeout(() => {
        setPhase('done');
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 460);
    };

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const normalized = duration > 0 ? Math.min(elapsed / duration, 1) : 1;
      const eased = easeInOut(normalized);

      setProgress((previous) => {
        const next = Math.min(100, Math.round(eased * 100));
        return next < previous ? previous : next;
      });

      if (normalized < 1) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        finish();
      }
    };

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (outroTimeoutRef.current) {
        window.clearTimeout(outroTimeoutRef.current);
      }
    };
  }, [duration, onComplete]);

  useEffect(() => {
    if (phase === 'done') {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setHeadlineIndex((previous) => (previous + 1) % HEADLINE_WORDS.length);
    }, HEADLINE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!lottieRef.current) {
      return;
    }

    if (phase === 'outro') {
      lottieRef.current.setSpeed?.(1.4);
    } else if (phase === 'active') {
      lottieRef.current.setSpeed?.(1);
    }
  }, [phase]);

  if (phase === 'done') {
    return null;
  }

  const progressRatio = Math.min(progress, 100) / 100;
  const formattedProgress = String(progress).padStart(2, '0');
  const statusLabel = useMemo(() => {
    const step =
      STATUS_STEPS.find((item) => progress < item.limit) ?? STATUS_STEPS[STATUS_STEPS.length - 1];
    return step.message;
  }, [progress]);

  const containerClasses = ['loading-portal', `is-${phase}`].join(' ');
  const containerStyle = { '--loading-progress': progressRatio };

  return (
    <div className={containerClasses} style={containerStyle}>
      <div className="loading-portal__veil" aria-hidden="true" />
      <div className="loading-portal__noise" aria-hidden="true" />

      <div className="loading-portal__inner">
        <div className="loading-portal__visual">
          <Lottie
            lottieRef={lottieRef}
            animationData={loadingAnimationData}
            loop
            autoplay
            className="loading-portal__lottie"
          />
          <div className="loading-portal__percent">
            <span className="loading-portal__percent-value">{formattedProgress}</span>
            <span className="loading-portal__percent-symbol">%</span>
          </div>
        </div>

        <div className="loading-portal__meta">
          <span className="loading-portal__tag">Media Narrative</span>
          <h2 className="loading-portal__headline" aria-live="polite">
            {HEADLINE_WORDS.map((word, index) => (
              <span
                key={word}
                className={`loading-portal__word${index === headlineIndex ? ' is-active' : ''}`}
              >
                {word}
              </span>
            ))}
          </h2>
          <div
            className="loading-portal__meter"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="loading-portal__meter-bar" />
          </div>
          <p className="loading-portal__status" role="status" aria-live="polite">
            {statusLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
