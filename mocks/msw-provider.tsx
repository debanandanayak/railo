"use client";

import { type ReactNode, useEffect, useState } from "react";
import { initMocks, mocksEnabled } from "./init";

export default function MockProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!mocksEnabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!mocksEnabled) {
      return;
    }

    let active = true;

    initMocks().then(
      () => {
        if (active) setReady(true);
      },
      (cause: unknown) => {
        if (active) {
          setError(
            new Error("MSW failed to start. Check the service worker setup.", {
              cause,
            }),
          );
        }
      },
    );

    return () => {
      active = false;
    };
  }, []);

  if (error) throw error;

  // Keep SSR and initial hydration consistent; mount consumers only when ready.
  return ready ? children : <output>Starting API mocks…</output>;
}
