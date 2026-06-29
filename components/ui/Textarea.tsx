import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-base font-medium text-slate-200 sm:text-sm">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={3}
        className={`w-full resize-none rounded-xl border border-dark-border/80 bg-dark/60 px-3.5 py-3 text-base text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-primary-500/70 focus:bg-dark-card focus:ring-2 focus:ring-primary-500/15 sm:px-4 sm:py-2.5 sm:text-sm ${error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/15' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400 sm:text-xs">{error}</p>}
    </div>
  ),
)
Textarea.displayName = 'Textarea'
