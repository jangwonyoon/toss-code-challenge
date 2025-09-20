import { forwardRef, type SelectHTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

const select = tv({
  base: [
    'w-full px-3 py-2 border rounded-md',
    'text-gray-900 bg-white',
    'focus:outline-none focus:ring-2 focus:border-transparent',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    'transition-colors duration-200',
    'appearance-none bg-no-repeat bg-right',
  ],
  variants: {
    variant: {
      default: [
        'border-gray-300',
        'hover:border-gray-400',
        'focus:ring-blue-500 focus:border-transparent',
        "bg-[url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] pr-10",
      ],
      error: [
        'border-red-500 bg-red-50',
        'hover:border-red-600',
        'focus:ring-red-500 focus:border-transparent',
        "bg-[url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23dc2626' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] pr-10",
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

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label: labelText,
      error,
      helperText,
      required,
      options,
      placeholder,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperTextId = helperText ? `${selectId}-helper` : undefined;

    const describedBy =
      [errorId, helperTextId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {labelText && (
          <label
            htmlFor={selectId}
            className={label({ required, error: !!error })}
          >
            {labelText}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={select({
            variant: error ? 'error' : 'default',
            className,
          })}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ color: '#6b7280' }}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';
