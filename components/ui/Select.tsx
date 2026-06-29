import { type SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      {hint && <p className="text-xs leading-relaxed text-slate-500">{hint}</p>}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={`w-full appearance-none rounded-xl border border-dark-border/80 bg-dark/60 px-4 py-2.5 pe-10 text-sm text-slate-100 outline-none transition-colors focus:border-primary-500/70 focus:bg-dark-card focus:ring-2 focus:ring-primary-500/15 ${error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/15' : ''} ${className}`}
          {...props}
        >
          <option value="">اختر البرنامج...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
)
Select.displayName = 'Select'
