import { useEffect, useRef, useState } from "react";

/**
 * Global singleton loader for Midtrans Snap SDK.
 *
 * Instead of loading/unloading the script on every component mount,
 * this hook ensures the script is loaded once and reused across
 * the application lifecycle.
 */

let snapLoadPromise: Promise<void> | null = null;

function loadMidtransScript(): Promise<void> {
  // Return existing promise if already loading/loaded
  if (snapLoadPromise) return snapLoadPromise;

  const snapUrl = import.meta.env.VITE_MIDTRANS_SNAP_URL;
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

  // If env vars are missing, resolve immediately (Snap won't be available)
  if (!snapUrl || !clientKey) {
    snapLoadPromise = Promise.resolve();
    return snapLoadPromise;
  }

  // Check if script already exists in DOM
  if (window.snap) {
    snapLoadPromise = Promise.resolve();
    return snapLoadPromise;
  }

  snapLoadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = snapUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Midtrans Snap SDK"));
    document.head.appendChild(script);
  });

  return snapLoadPromise;
}

/**
 * Hook to ensure Midtrans Snap SDK is loaded.
 * Returns `isReady` boolean and `error` if loading failed.
 *
 * @example
 * ```tsx
 * const { isReady } = useMidtransSnap();
 *
 * const handlePay = () => {
 *   if (!isReady) return;
 *   window.snap.pay(token, { ... });
 * };
 * ```
 */
export function useMidtransSnap() {
  const [isReady, setIsReady] = useState(() => !!window.snap);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    loadMidtransScript()
      .then(() => {
        if (mounted.current) setIsReady(true);
      })
      .catch((err: Error) => {
        if (mounted.current) setError(err.message);
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  return { isReady, error };
}
