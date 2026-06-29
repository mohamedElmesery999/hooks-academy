import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  hintInline?: boolean
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, hintInline, error, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {(label || hint) && (
        hintInline && label && hint ? (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-200">
              {label}
            </label>
            <span className="text-xs text-slate-500">{hint}</span>
          </div>
        ) : (
          <>
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-slate-200">
                {label}
              </label>
            )}
            {hint && <p className="text-xs leading-relaxed text-slate-500">{hint}</p>}
          </>
        )
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-xl border border-dark-border/80 bg-dark/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-primary-500/70 focus:bg-dark-card focus:ring-2 focus:ring-primary-500/15 ${error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/15' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
)
Input.displayName = 'Input'
