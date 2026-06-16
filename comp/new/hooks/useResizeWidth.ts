import { useCallback, useEffect, useRef, useState } from 'react';

export function useResizeWidth() {
  const [width, setWidth] = useState(0);
  const timerRef = useRef<number | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setWidth(entry.contentRect.width);
      }, 150);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { ref, width };
}
