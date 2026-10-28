'use client';

import { useSyncExternalStore } from 'react';

/** Cases à cocher mémorisées sur l'appareil (rien n'est envoyé au serveur) */
export function Checklist({ storageKey, items }: { storageKey: string; items: string[] }) {
  const raw = useSyncExternalStore(
    (notify) => {
      window.addEventListener('storage', notify);
      window.addEventListener('ts-checklist', notify);
      return () => {
        window.removeEventListener('storage', notify);
        window.removeEventListener('ts-checklist', notify);
      };
    },
    () => {
      try {
        return localStorage.getItem(storageKey) ?? '[]';
      } catch {
        return '[]';
      }
    },
    () => '[]',
  );
  const done: number[] = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  })();
  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((d) => d !== i) : [...done, i];
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event('ts-checklist'));
    } catch {
      // stockage indisponible (navigation privée)
    }
  };
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={item}>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/40 bg-surface-light px-4 py-3 text-sm">
            <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#6366f1]" />
            <span className={done.includes(i) ? 'text-muted line-through' : 'text-foreground'}>{item}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
