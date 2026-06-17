import { useCallback, useRef, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
  // top: number;
  // left: number;
  // x: number;
  // y: number;
}

export function useMeasure<T extends HTMLElement>() {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    // top: 0,
    // left: 0,
    // x: 0,
    // y: 0,
  });

  const observerRef = useRef<ResizeObserver | null>(null);
  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node !== null) {
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
        });
      });
      resizeObserver.observe(node);
      observerRef.current = resizeObserver;
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { ref, ...dimensions };
}
