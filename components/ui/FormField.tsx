'use client';
import { ReactNode } from 'react';

const inputStyles = "w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function FormField({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  required,
  autoComplete,
  defaultValue,
  value,
  onChange,
  disabled,
  error,
  icon,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${inputStyles} ${icon ? 'pl-10 pr-10' : ''} ${error ? 'border-destructive focus:ring-destructive' : ''}`}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

export { inputStyles };
