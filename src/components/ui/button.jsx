import { forwardRef } from 'react'

const variantStyles = {
  default:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm hover:shadow-md active:scale-[0.98]',
  destructive:
    'bg-[var(--color-destructive)] text-white hover:bg-red-600 shadow-sm active:scale-[0.98]',
  outline:
    'border-2 border-[var(--color-border)] bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-800 active:scale-[0.98]',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]',
  accent:
    'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-sm hover:shadow-md active:scale-[0.98]',
  link:
    'text-[var(--color-primary)] underline-offset-4 hover:underline hover:text-[var(--color-primary-hover)]',
}

export const Button = forwardRef(
  ({ className = '', variant = 'default', size = 'default', as: Comp = 'button', ...props }, ref) => {
    const sizeStyles = {
      default: 'h-10 px-4 py-2 rounded-lg',
      sm: 'h-9 rounded-lg px-3 text-sm',
      lg: 'h-11 rounded-xl px-8 text-base',
      icon: 'h-10 w-10 rounded-lg',
    }
    return (
      <Comp
        ref={ref}
        className={`inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.default} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
