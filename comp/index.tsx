import { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import * as GeneratedIcons from './generated';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: IconSize;
}
export type IconName = keyof typeof GeneratedIcons;
type IconSize = 'sm' | 'md' | 'lg';
const sizeStyle: Record<IconSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export function Icon({ name, size = 'md', className, ...props }: IconProps) {
  if (!name || !GeneratedIcons[name]) return null;
  const SVGIcon = GeneratedIcons[name];

  if (typeof SVGIcon !== 'function') {
    return <span>SVG Error</span>;
  }
  return (
    <SVGIcon
      className={cn('inline-flex shrink-0 items-center', sizeStyle[size], className)}
      {...props}
    />
  );
}
