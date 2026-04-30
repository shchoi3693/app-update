import { FC, SVGProps } from 'react';
import { Icon, IconName, IconProps } from '@/components/ui/icon';
import * as IconComp from '@/components/ui/icon/IconComponents';

export const CATEGORY_ICONS = (['Box'] as const).map((name) => ({
  name,
  icon: (props: Omit<IconProps, 'name'>) => <Icon name={name} {...props} />,
})) satisfies readonly { name: IconName; icon: FC<SVGProps<SVGSVGElement>> }[];
export type CategoryIconName = (typeof CATEGORY_ICONS)[number]['name'];

export const CATEGORY_COLORS = [
  {
    label: '파란색',
    color: 'chart-1',
    bg: 'bg-chart-1',
    text: 'text-chart-1',
    outline: 'outline-chart-1',
  },
  {
    label: '녹색',
    color: 'chart-2',
    bg: 'bg-chart-2',
    text: 'text-chart-2',
    outline: 'outline-chart-2',
  },
  {
    label: '노란색',
    color: 'chart-3',
    bg: 'bg-chart-3',
    text: 'text-chart-3',
    outline: 'outline-chart-3',
  },
  {
    label: '보라색',
    color: 'chart-4',
    bg: 'bg-chart-4',
    text: 'text-chart-4',
    outline: 'outline-chart-4',
  },
  {
    label: '주황색',
    color: 'chart-5',
    bg: 'bg-chart-5',
    text: 'text-chart-5',
    outline: 'outline-chart-5',
  },
] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number]['color'];
