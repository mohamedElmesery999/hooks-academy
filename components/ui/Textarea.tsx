import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={4}
        className={`w-full resize-none rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
)
Textarea.displayName = 'Textarea'
