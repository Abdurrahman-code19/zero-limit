export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-2/3 bg-muted rounded" />
          <div className="flex gap-2 mt-6">
            {["S","M","L","XL"].map(s => <div key={s} className="h-12 w-12 bg-muted rounded" />)}
          </div>
          <div className="h-14 w-full bg-muted rounded mt-8" />
        </div>
      </div>
    </div>
  )
}
