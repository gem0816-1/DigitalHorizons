interface ToastProps {
  open: boolean;
  message: string;
  type: 'success' | 'error';
}

export function Toast({ open, message, type }: ToastProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed left-1/2 top-5 z-[70] -translate-x-1/2 rounded-xl border px-4 py-2 text-sm ${
        type === 'success'
          ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-200'
          : 'border-red-400/60 bg-red-500/15 text-red-200'
      }`}
    >
      {message}
    </div>
  );
}
