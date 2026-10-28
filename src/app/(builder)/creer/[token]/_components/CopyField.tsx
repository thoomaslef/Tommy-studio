'use client';

import { useState } from 'react';

/** Texte à copier en un clic (pratique sur téléphone) */
export function CopyField({ label, value, multiline = false, hint }: { label: string; value: string; multiline?: boolean; hint?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // presse-papiers indisponible : le texte reste sélectionnable
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="flex-shrink-0 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/50"
        >
          {copied ? 'Copié ✓' : 'Copier'}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {multiline ? (
        <textarea readOnly value={value} rows={Math.min(10, Math.max(3, Math.ceil(value.length / 55)))} onFocus={(e) => e.target.select()} className="mt-2 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-base text-foreground outline-none sm:text-sm" />
      ) : (
        <input readOnly value={value} onFocus={(e) => e.target.select()} className="mt-2 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-base text-foreground outline-none sm:text-sm" />
      )}
    </div>
  );
}
