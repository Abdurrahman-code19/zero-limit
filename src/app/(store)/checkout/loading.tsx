export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="h-8 w-48 bg-muted rounded mb-8" />
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="md:col-span-2">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
