export function Card({ className = '', hover, ...props }) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white text-slate-900 shadow-[var(--shadow-card)] transition-all duration-200 ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }) {
  return (
    <div
      className={`text-xl font-semibold leading-tight tracking-tight text-slate-900 ${className}`}
      {...props}
    />
  )
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`text-sm text-slate-500 ${className}`} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 pt-0 ${className}`.trim()} {...props} />
}

export function CardFooter({ className = '', ...props }) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
}
