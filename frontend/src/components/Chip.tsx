import * as React from 'react';
import { cn } from '../utils/mergeClassNames';

type ChipVariant = 'primary' | 'soft' | 'outline';

export type ChipProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
};

const base = 'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold';

const variants: Record<ChipVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white',
  soft: 'bg-[var(--color-accent-sky)] text-[var(--color-accent-navy)]',
  outline: 'bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)]',
};

export function Chip({ className, variant = 'primary', ...props }: ChipProps) {
  return <span className={cn(base, variants[variant], className)} {...props} />;
}
