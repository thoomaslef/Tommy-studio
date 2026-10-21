export type AssetView = { id: string; kind: 'photo' | 'logo'; position: number; url: string };

/** Réduit la photo dans le navigateur (photos de téléphone souvent > 5 Mo) */
async function compress(file: File, kind: 'photo' | 'logo') {
  const maxSide = kind === 'logo' ? 800 : 1800;
  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await createImageBitmap(file);
  } catch {
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image illisible'));
      img.src = URL.createObjectURL(file);
    });
  }
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image illisible');
  // Un logo PNG garde sa transparence ; tout le reste devient un JPEG léger
  const type = kind === 'logo' && file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  if (type === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(source, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
  if (!blob) throw new Error('Image illisible');
  return { blob, type, width, height };
}

function put(url: string, blob: Blob, type: string, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', type);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Envoi refusé (${xhr.status})`)));
    xhr.onerror = () => reject(new Error('Connexion interrompue'));
    xhr.send(blob);
  });
}

export async function uploadPhoto(token: string, file: File, kind: 'photo' | 'logo', onProgress: (pct: number) => void): Promise<AssetView> {
  if (!file.type.startsWith('image/')) throw new Error('Ce fichier n’est pas une image.');
  const { blob, type, width, height } = await compress(file, kind);

  const ask = await fetch(`/api/projets/${token}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, type }),
  });
  const slot = await ask.json();
  if (!ask.ok) throw new Error(slot.error || 'Envoi impossible.');

  await put(slot.uploadUrl, blob, type, onProgress);

  const done = await fetch(`/api/projets/${token}/photos/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: slot.path, kind, width, height }),
  });
  const result = await done.json();
  if (!done.ok) throw new Error(result.error || 'Envoi impossible.');
  return result.asset as AssetView;
}
