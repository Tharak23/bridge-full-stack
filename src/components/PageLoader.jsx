export default function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-4" aria-busy="true" aria-label={message}>
      <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin shrink-0" />
      <p className="mt-4 text-slate-500 text-sm animate-pulse">{message}</p>
    </div>
  )
}
