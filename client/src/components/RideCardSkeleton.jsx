const RideCardSkeleton = () => {
  return (
    <article className="section-card animate-pulse p-4">
      <div className="mb-3 h-5 w-3/5 rounded bg-slate-200" />
      <div className="space-y-2">
        <div className="h-3 w-4/5 rounded bg-slate-200" />
        <div className="h-3 w-3/5 rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-8 rounded-xl bg-slate-200" />
        <div className="h-8 rounded-xl bg-slate-200" />
      </div>
    </article>
  )
}

export default RideCardSkeleton
