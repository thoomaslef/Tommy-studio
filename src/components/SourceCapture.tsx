'use client';

import { useEffect } from 'react';
import { SOURCE_STORAGE_KEY, sourceFromSearch } from '@/lib/source';

/** Mémorise l'origine d'un lien de campagne (?utm_source=…) le temps de la visite, sans cookie */
export default function SourceCapture() {
  useEffect(() => {
    const source = sourceFromSearch(window.location.search);
    if (!source) return;
    try {
      // La première origine de la visite est celle qui compte
      if (!sessionStorage.getItem(SOURCE_STORAGE_KEY)) sessionStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(source));
    } catch {
      // stockage indisponible
    }
  }, []);
  return null;
}
