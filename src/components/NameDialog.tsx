import { useState } from 'react';

interface NameDialogProps {
  open: boolean;
  initialName?: string;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}

export function NameDialog({ open, initialName = 'My Build Plan', onCancel, onConfirm }: NameDialogProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-950 p-4">
        <h3 className="text-lg font-semibold text-slate-100">Save Build Plan</h3>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) {
              setError('');
            }
          }}
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
        />
        {error ? <div className="mt-2 text-xs text-red-300">{error}</div> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              const value = name.trim();
              if (!value) {
                setError('Build name is required.');
                return;
              }
              onConfirm(value);
            }}
            className="cursor-pointer rounded-lg bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
