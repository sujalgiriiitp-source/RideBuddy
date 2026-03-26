const ErrorBanner = ({ message, className = '' }) => {
  if (!message) {
    return null
  }

  return (
    <div className={`rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 ${className}`}>
      {message}
    </div>
  )
}

export default ErrorBanner
