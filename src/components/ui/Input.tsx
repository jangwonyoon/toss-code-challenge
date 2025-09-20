import { forwardRef, type InputHTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

const input = tv({
  base: [
    'w-full px-3 py-2 border rounded-md',
    'text-gray-900 placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:border-transparent',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    'transition-colors duration-200',
  ],
  variants: {
    variant: {
      default: [
        'border-gray-300 bg-white',
        'hover:border-gray-400',
        'focus:ring-blue-500 focus:border-blue-500',
      ],
      error: [
        'border-red-500 bg-red-50',
        'hover:border-red-600',
        'focus:ring-red-500 focus:border-red-500',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const label = tv({
  base: 'block text-sm font-medium text-gray-700 mb-2',
  variants: {
    required: {
      true: "after:content-['*'] after:text-red-500 after:ml-1",
    },
    error: {
      true: 'text-red-700',
    },
  },
});

const errorMessage = tv({
  base: 'mt-1 text-sm text-red-600 flex items-center gap-1',
});

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label: labelText, error, helperText, required, className, id, ...props },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;

    const describedBy =
      [errorId, helperTextId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {labelText && (
          <label
            htmlFor={inputId}
            className={label({ required, error: !!error })}
          >
            {labelText}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={input({
            variant: error ? 'error' : 'default',
            className,
          })}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />

        {error && (
          <div
            id={errorId}
            className={errorMessage()}
            role="alert"
            aria-live="polite"
          >
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {helperText && !error && (
          <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
