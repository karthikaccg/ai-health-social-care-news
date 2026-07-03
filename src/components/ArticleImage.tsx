"use client";

import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  gradient: string;
  label: string;
  source?: string;
  className?: string;
};

/** Article image with a category-coloured gradient fallback when missing or broken. */
export default function ArticleImage({ src, alt, gradient, label, source, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`relative bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="relative flex flex-col items-center gap-1.5 opacity-90">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span className="text-white text-xs font-bold uppercase tracking-widest">{label}</span>
          {source && <span className="text-white/70 text-[11px] font-medium">via {source}</span>}
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
