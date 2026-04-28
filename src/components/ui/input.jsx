import { forwardRef } from 'react'

export const Input = forwardRef(({ className = '', type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-black/[0.03] ${className}`}
      {...props}
    />
  )
})
Input.displayName = 'Input'
