export default function StoreLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-6 w-24 bg-muted rounded mb-6" />
      <div className="h-10 w-64 bg-muted rounded mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
