import React from 'react';

/**
 * Polymorphic Button.
 *
 * One component that can render as any element via the `as` prop, so the same
 * visual button can be a real `<button>`, an `<a>` (e.g. `tel:`), or a router
 * `<Link>` — without duplicating class strings at every call site.
 *
 *   <Button onClick={fn}>Save</Button>              // renders <button>
 *   <Button as="a" href={TEL_LINK}>Call</Button>      // renders <a>
 *   <Button as={Link} to="/x" variant="primary">…   // renders <Link>
 *
 * Type safety: the required props of the chosen `as` element are preserved, so
 * you cannot pass `href` to a `<button>` or `onClick`-only to a link without a
 * type error.
 */

export type ButtonVariant =
  | 'primary'
  | 'whatsapp'
  | 'outline'
  | 'ghost'
  | 'subtle'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold ' +
  'transition-colors cursor-pointer select-none whitespace-nowrap ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#34398e]/40 ' +
  'focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-[#34398e] text-white hover:bg-[#282c6e] shadow-sm',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1eb85a] shadow-sm',
  outline: 'bg-white text-[#34398e] border border-[#34398e]/25 hover:bg-[#34398e]/5',
  subtle: 'bg-[#34398e]/5 text-[#34398e] border border-[#34398e]/10 hover:bg-[#34398e]/10',
  ghost: 'bg-transparent text-[#34398e] hover:bg-[#34398e]/5',
  danger: 'bg-[#e52421] text-white hover:bg-[#c11e1c] shadow-sm',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-sm px-6 py-3',
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType> =
  CommonProps & {
    /** The element or component to render as. @default 'button' */
    as?: T;
  } & Omit<React.ComponentPropsWithoutRef<T>, 'className' | 'children'>;

export function Button<T extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: PolymorphicProps<T>) {
  const Comp = (as || 'button') as React.ElementType;
  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Comp className={classes} {...rest}>
      {children}
    </Comp>
  );
}

export default Button;
