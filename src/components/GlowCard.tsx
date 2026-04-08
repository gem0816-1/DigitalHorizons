import type { PropsWithChildren } from 'react';

interface GlowCardProps extends PropsWithChildren {
  className?: string;
}

export function GlowCard({ children, className }: GlowCardProps) {
  return (
    <section
      className={`surface-panel transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)] ${className ?? ''}`.trim()}
    >
      {children}
    </section>
  );
}
