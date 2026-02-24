const variants = {
  default: 'border-transparent bg-teal-100 text-teal-800',
  secondary: 'border-transparent bg-slate-100 text-slate-700',
  success: 'border-transparent bg-emerald-100 text-emerald-800',
  destructive: 'border-transparent bg-red-100 text-red-800',
  warning: 'border-transparent bg-amber-100 text-amber-800',
  outline: 'border border-slate-200 bg-white text-slate-700',
}

export function Badge({ className = '', variant = 'default', ...props }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  )
}
