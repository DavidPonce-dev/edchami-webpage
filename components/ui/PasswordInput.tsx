'use client';

import { InputHTMLAttributes, useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@/components/Icons';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showToggle?: boolean;
  error?: string;
}

export function PasswordInput({ showToggle = true, className = '', error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${error ? 'pb-5' : ''}`}>
      <input
        type={showPassword ? 'text' : 'password'}
        className={`w-full px-3 py-2 pr-10 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${error ? 'border-destructive focus:ring-destructive' : ''} ${className}`}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOffIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      )}
      {error && (
        <p className="text-sm text-destructive absolute -bottom-5 left-0">{error}</p>
      )}
    </div>
  );
}
