"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getMotionPreference = () => window.matchMedia(motionQuery).matches;
const getServerMotionPreference = () => true;

// Positions follow the banner's native coordinates, including its mobile crop.
const droplets = [
  { x: 1128, y: 170, size: 0.65, delay: -1.2, duration: 6.8, travel: 135 },
  { x: 1291, y: 225, size: 0.5, delay: -4.4, duration: 8.2, travel: 180 },
  { x: 1147, y: 380, size: 0.45, delay: -5.9, duration: 7.4, travel: 115 },
  { x: 942, y: 310, size: 0.72, delay: -2.9, duration: 7.6, travel: 280 },
  { x: 1395, y: 215, size: 0.58, delay: -6.1, duration: 9.2, travel: 350 },
  { x: 1790, y: 345, size: 0.62, delay: -0.8, duration: 8.4, travel: 245 },
  { x: 1970, y: 255, size: 0.5, delay: -4.8, duration: 10, travel: 360 },
];

const ripples = [
  { x: 930, y: 691, width: 90, delay: -2.6 },
  { x: 1382, y: 701, width: 115, delay: -0.5 },
  { x: 1765, y: 676, width: 100, delay: -4.1 },
  { x: 1980, y: 714, width: 85, delay: -1.7 },
];

type MotionStyle = CSSProperties & Record<`--${string}`, string | number>;

export default function HeroWaterEffects() {
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, getServerMotionPreference);
  const [manualPause, setManualPause] = useState<boolean | null>(null);
  const paused = manualPause ?? reducedMotion;

  return (
    <div className={`hero-water-effects ${paused ? "is-paused" : "is-playing"}`}>
      <svg className="hero-water-overlay" viewBox="0 0 2089 753" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="hero-droplet-fill" cx="30%" cy="25%" r="80%">
            <stop offset="0" stopColor="white" stopOpacity="0.9" />
            <stop offset="0.28" stopColor="#eafaff" stopOpacity="0.15" />
            <stop offset="0.75" stopColor="#86c9e0" stopOpacity="0.18" />
            <stop offset="1" stopColor="white" stopOpacity="0.65" />
          </radialGradient>
          <linearGradient id="hero-ripple-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="white" stopOpacity="0.1" />
            <stop offset="0.45" stopColor="white" stopOpacity="0.9" />
            <stop offset="1" stopColor="#b7e7fa" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {droplets.map((drop, index) => (
          <g key={index} transform={`translate(${drop.x} ${drop.y})`}>
            <g className="hero-water-drop" style={{ "--water-delay": `${drop.delay}s`, "--water-duration": `${drop.duration}s`, "--water-travel": `${drop.travel}px` } as MotionStyle}>
              <g transform={`scale(${drop.size})`}>
                <path d="M0-16C-2-9-9-1-9 5a9 9 0 0 0 18 0C9-1 2-9 0-16Z" fill="url(#hero-droplet-fill)" stroke="white" strokeOpacity="0.7" strokeWidth="1" />
                <path d="M-4 1Q-7 5-4 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </g>
          </g>
        ))}
        {ripples.map((ripple, index) => (
          <g key={index} transform={`translate(${ripple.x} ${ripple.y})`}>
            <g className="hero-water-ripple" style={{ "--water-delay": `${ripple.delay}s` } as MotionStyle}>
              <ellipse rx={ripple.width} ry={ripple.width * 0.15} fill="none" stroke="url(#hero-ripple-stroke)" strokeWidth="1.6" />
              <ellipse rx={ripple.width * 0.68} ry={ripple.width * 0.1} fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
            </g>
          </g>
        ))}
      </svg>
      <button type="button" className="hero-motion-toggle" onClick={() => setManualPause(!paused)} aria-label={paused ? "เล่นเอฟเฟกต์หยดน้ำ" : "หยุดเอฟเฟกต์หยดน้ำ"} aria-pressed={!paused} title={paused ? "เล่นเอฟเฟกต์หยดน้ำ" : "หยุดเอฟเฟกต์หยดน้ำ"}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M5 3v10l8-5Z" /> : <><rect x="4" y="3" width="3" height="10" rx="1" /><rect x="9" y="3" width="3" height="10" rx="1" /></>}
        </svg>
      </button>
    </div>
  );
}
