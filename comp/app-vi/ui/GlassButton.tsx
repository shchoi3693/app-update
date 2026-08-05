import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function GlassButton({ children, className, ...props }: GlassButtonProps) {
  return (
    <button
      type="button"
      className={cn('flex min-w-12 cursor-pointer items-center justify-center px-3', className)}
      {...props}
    >
      {children}
    </button>
  );
}
