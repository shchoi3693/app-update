import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

interface GlassBgProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function GlassBg({ children, className, ...props }: GlassBgProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className="pointer-events-none absolute inset-0 rounded-full backdrop-blur-[3px]"
        style={{ filter: `url(#glassLensSvg) saturate(110%) brightness(1.15)` }}
      ></div>
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: `inset 1px 1px 0 0 #eceeee,
      inset -4px -4px 0px -4px #fff,
      inset -1px -1px 0 0 #d4d6d6cc,
      inset 1px 1px 5px 0 #d5d8d866,
      inset -4px -5px 8px 0 #6d707013,
      0px 2px 6px 1px rgba(0, 0, 0, 0.08)`,
        }}
      ></div>
      <div className="mix-blend-difference">{children}</div>
    </div>
  );
}
