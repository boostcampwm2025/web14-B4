import * as React from 'react';
import { cn } from '../utils/mergeClassNames';

type ButtonVariant = 'primary' | 'secondary' | 'dashed';
type ButtonSize = 'fixed' | 'cta';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  'inline-flex items-center justify-center whitespace-nowrap font-semibold transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:brightness-90 active:brightness-80',
  secondary:
    'bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-accent-sky)] active:brightness-95',
  dashed:
    'bg-white text-[var(--color-primary)] border border-dashed border-[var(--color-primary)] hover:bg-[var(--color-accent-sky)] active:brightness-95',
};

const sizes: Record<ButtonSize, string> = {
  fixed: 'w-[110px] h-10 rounded-lg',
  cta: 'h-10 px-8 rounded-xl text-base',
};

export function Button({
  className,
  variant = 'primary',
  size = 'fixed',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
