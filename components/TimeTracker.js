'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logEvent } from '../lib/logEvent';

export default function TimeTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const started = Date.now();
    logEvent({ kind: 'PAGE_VIEW', path: pathname });
    return () => {
      const durationMs = Date.now() - started;
      if (durationMs > 800) {
        logEvent({ kind: 'TIME_ON_PAGE', path: pathname, durationMs });
      }
    };
  }, [pathname]);

  return null;
}
