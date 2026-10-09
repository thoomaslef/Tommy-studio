'use client';

import { useRef, useState, FormEvent, DragEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  ACCEPT_ATTRIBUTE,
  EMAIL_PATTERN,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  formatSize,
  isAllowedType,
} from '@/lib/upload-config';

type Item = {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
};

const field = {
  input:
    'w-full rounded-xl border border-border/50 bg-background/50 px-5 py-4 text-sm text-foreground placeholder-muted/60 outline-none transition-all duration-300 hover:border-border focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-background',
  label: 'mb-3 block text-sm font-semibold text-foreground',
};

let counter = 0;
const newId = () => `f${Date.now()}-${counter++}`;

function putFile(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`)));
    xhr.onerror = () => reject(new Error('network'));
    xhr.send(file);
  });
}

export default function EnvoiFichiersContent() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // champ piège anti-robots
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [receivedCount, setReceivedCount] = useState(0);

  const folderRef = useRef<string | null>(null);
  const keysRef = useRef<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const totalSize = items.reduce((sum, it) => sum + it.file.size, 0);
  const uploading = phase === 'uploading';

  const patch = (id: string, change: Partial<Item>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...change } : it)));

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list);
    const problems: string[] = [];
    const accepted: Item[] = [];
    let runningTotal = totalSize;

    for (const file of incoming) {
      if (items.length + accepted.length >= MAX_FILES) {
        problems.push(`Maximum ${MAX_FILES} fichiers.`);
        break;
      }
      if (!isAllowedType(file.type)) {
        problems.push(`« ${file.name} » : type non accepté.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        problems.push(`« ${file.name} » dépasse ${formatSize(MAX_FILE_SIZE)}.`);
        continue;
      }
      if (runningTotal + file.size > MAX_TOTAL_SIZE) {
        problems.push(`« ${file.name} » : total de ${formatSize(MAX_TOTAL_SIZE)} dépassé.`);
        continue;
      }
      if (items.some((it) => it.file.name === file.name && it.file.size === file.size)) continue;
      runningTotal += file.size;
      accepted.push({ id: newId(), file, status: 'pending', progress: 0 });
    }

    if (accepted.length) setItems((prev) => [...prev, ...accepted]);
    setError(problems.slice(0, 3).join(' '));
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!uploading && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeItem = (id: string) => {
    delete keysRef.current[id];
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Indiquez votre nom.');
    if (!EMAIL_PATTERN.test(email.trim())) return setError('Entrez un email valide.');
    if (items.length === 0) return setError('Ajoutez au moins un fichier.');

    const pending = items.filter((it) => it.status !== 'done');
    setPhase('uploading');

    try {
      if (pending.length > 0) {
        const signRes = await fetch('/api/upload/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            website,
            folder: folderRef.current ?? undefined,
            files: pending.map((it) => ({ name: it.file.name, type: it.file.type, size: it.file.size })),
          }),
        });
        const signData = await signRes.json();
        if (!signRes.ok) throw new Error(signData.error || 'Impossible de préparer l\'envoi.');
        folderRef.current = signData.folder;

        const uploads: { key: string; url: string }[] = signData.uploads;
        let cursor = 0;
        const worker = async () => {
          while (cursor < pending.length) {
            const index = cursor++;
            const item = pending[index];
            const target = uploads[index];
            patch(item.id, { status: 'uploading', progress: 0 });
            try {
              await putFile(target.url, item.file, (pct) => patch(item.id, { progress: pct }));
              keysRef.current[item.id] = target.key;
              patch(item.id, { status: 'done', progress: 100 });
            } catch {
              patch(item.id, { status: 'error', progress: 0 });
            }
          }
        };
        await Promise.all(Array.from({ length: Math.min(3, pending.length) }, worker));
      }

      const keys = items.map((it) => keysRef.current[it.id]).filter(Boolean);
      if (keys.length < items.length) {
        throw new Error(
          `${items.length - keys.length} fichier(s) n'ont pas pu être envoyés. Vérifiez votre connexion et appuyez de nouveau sur « Envoyer ».`,
        );
      }

      const doneRes = await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message, folder: folderRef.current, keys }),
      });
      const doneData = await doneRes.json();
      if (!doneRes.ok) throw new Error(doneData.error || 'Erreur lors de la validation de l\'envoi.');

      setReceivedCount(doneData.received ?? keys.length);
      setPhase('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setPhase('idle');
    }
  };

  return (
    <section className="relative hero-spacing overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative section-container !max-w-3xl">
        <div className="text-center">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-xs font-semibold tracking-wide text-accent">
            Photos · Vidéos · Documents
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Envoyez-moi
            <br />
            <span className="gradient-text glow-text">vos fichiers</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Logo, photos de vos réalisations, vidéos, textes… Tout ce qui servira à créer votre site.
            Vous pouvez envoyer plusieurs fichiers d&apos;un coup, depuis votre téléphone ou votre ordinateur.
          </p>
        </div>

        <div className="mt-14">
          {phase === 'done' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-2xl border border-accent/20 bg-surface-light p-10 text-center glow"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/20 bg-accent/10">
                <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">
                {receivedCount} fichier{receivedCount > 1 ? 's' : ''} bien reçu{receivedCount > 1 ? 's' : ''} !
              </h2>
              <p className="mt-4 max-w-md text-muted leading-relaxed">
                Merci {name.trim()}. Je regarde tout ça et je reviens vers vous par email. Vous pouvez fermer cette page.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="gradient-border rounded-2xl bg-surface-light p-6 sm:p-12">
              {/* Honeypot : invisible pour les humains */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Site web
                  <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={field.label}>
                    Nom <span className="text-accent">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                    disabled={uploading}
                    autoComplete="name"
                    className={field.input}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={field.label}>
                    Email <span className="text-accent">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    disabled={uploading}
                    autoComplete="email"
                    className={field.input}
                  />
                </div>
              </div>

              <div className="mt-8">
                <span className={field.label}>
                  Fichiers <span className="text-accent">*</span>
                </span>
                <label
                  htmlFor="files"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    dragging ? 'border-accent bg-accent/10' : 'border-border/60 hover:border-accent/50 hover:bg-accent/5'
                  } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <svg className="mb-3 h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">Touchez pour choisir vos fichiers</span>
                  <span className="mt-1 text-xs text-muted">ou glissez-les ici</span>
                  <span className="mt-4 text-[11px] text-muted/60">
                    {MAX_FILES} fichiers max · {formatSize(MAX_FILE_SIZE)} par fichier · {formatSize(MAX_TOTAL_SIZE)} au total
                  </span>
                  <input
                    ref={inputRef}
                    id="files"
                    type="file"
                    multiple
                    accept={ACCEPT_ATTRIBUTE}
                    onChange={onPick}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>

                {items.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {items.map((it) => (
                      <li key={it.id} className="rounded-xl border border-border/40 bg-background/40 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{it.file.name}</p>
                            <p className="text-xs text-muted">
                              {formatSize(it.file.size)}
                              {it.status === 'done' && <span className="ml-2 text-accent">· envoyé</span>}
                              {it.status === 'error' && <span className="ml-2 text-red-400">· échec, réessayez</span>}
                            </p>
                          </div>
                          {!uploading && it.status !== 'done' && (
                            <button
                              type="button"
                              onClick={() => removeItem(it.id)}
                              aria-label={`Retirer ${it.file.name}`}
                              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {(it.status === 'uploading' || it.status === 'done') && (
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/40">
                            <div className="h-full rounded-full bg-accent transition-all duration-200" style={{ width: `${it.progress}%` }} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {items.length > 0 && (
                  <p className="mt-3 text-xs text-muted/70">
                    {items.length} fichier{items.length > 1 ? 's' : ''} · {formatSize(totalSize)}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <label htmlFor="message" className={field.label}>
                  Un mot pour moi <span className="text-xs font-normal text-muted">(facultatif)</span>
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex : la photo n°3 est pour la page d'accueil, le logo est en pièce jointe…"
                  disabled={uploading}
                  className={`${field.input} resize-none`}
                />
              </div>

              {error && (
                <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="mt-10 w-full rounded-xl bg-accent px-8 py-5 text-base font-bold text-white shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/40 disabled:cursor-wait disabled:opacity-70"
              >
                {uploading ? 'Envoi en cours… ne fermez pas la page' : 'Envoyer mes fichiers'}
              </button>
              <p className="mt-4 text-center text-xs text-muted/60">
                Vos fichiers ne sont utilisés que pour la création de votre site.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
