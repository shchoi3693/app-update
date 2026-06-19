import React, { HTMLAttributes } from 'react';
//import {cn}from '@/lib/uti'

export default function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="skeleton" className={`animate-pulse ${className ?? ''}`} {...props} />;
}
