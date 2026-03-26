const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex min-h-[160px] w-full items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-card">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
    </div>
  )
}

export default LoadingSpinner
