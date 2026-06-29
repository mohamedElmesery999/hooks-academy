import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'gradient-btn text-white shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30',
  secondary: 'bg-dark-card border border-dark-border text-slate-200 hover:border-primary-500/50 hover:text-white',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  danger: 'bg-red-600/90 text-white hover:bg-red-500',
  success: 'bg-emerald-600/90 text-white hover:bg-emerald-500',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-2 text-base sm:text-sm',
  md: 'px-5 py-3 text-base sm:py-2.5 sm:text-sm',
  lg: 'px-6 py-3.5 text-lg sm:px-7 sm:py-3 sm:text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
