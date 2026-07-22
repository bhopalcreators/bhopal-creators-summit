import { useEffect, useState } from 'react';
import api from '../lib/api';

/**
 * useApiContent('/stats', fallbackStats, 'items')
 *
 * Tries the live API first. If it fails (backend not running yet, DB not
 * seeded, network hiccup), silently falls back to the static content in
 * src/data/siteContent.js so the site never shows a broken/empty section.
 * `extract` picks the array off the response envelope ('items' for list
 * endpoints, 'settings' for the singleton, etc).
 */
export function useApiContent(path, fallback, extract = 'items') {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get(path)
      .then((res) => {
        if (cancelled) return;
        const value = extract ? res?.[extract] : res;
        if (Array.isArray(value) ? value.length > 0 : value) {
          setData(value);
        } else {
          setUsingFallback(true);
        }
      })
      .catch(() => {
        if (!cancelled) setUsingFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, loading, usingFallback };
}

export default useApiContent;
