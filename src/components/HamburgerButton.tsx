interface HamburgerButtonProps {
  open: boolean;
  onClick: () => void;
  ariaControls?: string;
  ariaLabelOpen?: string;
  ariaLabelClose?: string;
  className?: string;
}

export function HamburgerButton({
  open,
  onClick,
  ariaControls,
  ariaLabelOpen = 'Open menu',
  ariaLabelClose = 'Close menu',
  className,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      aria-controls={ariaControls}
      aria-expanded={open}
      aria-label={open ? ariaLabelClose : ariaLabelOpen}
      onClick={onClick}
      className={`group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-[var(--menu-button-bg)] text-[var(--nav-ink)] transition-all duration-300 hover:scale-[1.03] hover:border-black/20 ${className ?? ''}`.trim()}
    >
      <span className="relative block h-4 w-5">
        <span
          className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-all duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
        />
        <span
          className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-all duration-200 ${open ? 'opacity-0' : 'opacity-100'}`}
        />
        <span
          className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-all duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
        />
      </span>
    </button>
  );
}
