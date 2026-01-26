export default function InsightLoading() {
  return (
    <div className="container py-10 space-y-8">
      <div className="h-10 w-3/4 mx-auto rounded-full bg-white/10 animate-pulse" />
      <div className="h-5 w-1/2 mx-auto rounded-full bg-white/5 animate-pulse" />
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-4 w-1/3 rounded-full bg-white/10 animate-pulse" />
        <div className="h-4 w-2/3 rounded-full bg-white/10 animate-pulse" />
        <div className="h-56 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-4 w-full rounded-full bg-white/10 animate-pulse" />
        <div className="h-4 w-11/12 rounded-full bg-white/10 animate-pulse" />
        <div className="h-4 w-4/5 rounded-full bg-white/10 animate-pulse" />
      </div>
    </div>
  )
}
