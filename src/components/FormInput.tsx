import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  id: string;
  label: string;
  error?: string;
}

export function FormInput({ id, label, error, ...rest }: FormInputProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm text-black/58">{label}</span>
      <input
        id={id}
        {...rest}
        className={`field-shell ${
          error ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(180,35,24,0.12)]' : ''
        }`}
      />
      {error ? <span className="mt-2 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
