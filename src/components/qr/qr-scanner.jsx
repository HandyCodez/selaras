"use client";

import { useEffect, useId, useRef } from "react";

export function QrScanner({ onScan, paused = false }) {
  const rawId = useId();
  const elementId = `qr-reader-${rawId.replace(/:/g, "")}`;
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (paused) return;
    let scanner;
    let cancelled = false;

    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      if (cancelled) return;
      scanner = new Html5QrcodeScanner(
        elementId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      );
      scanner.render(
        (decodedText) => onScanRef.current?.(decodedText),
        () => {},
      );
    });

    return () => {
      cancelled = true;
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [elementId, paused]);

  return <div id={elementId} className="mx-auto max-w-sm" />;
}
