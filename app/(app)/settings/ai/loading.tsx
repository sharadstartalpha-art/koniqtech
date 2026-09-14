export default function AISettingsLoading() {
  return (
    <div className="space-y-6">
      {/* AI navigation skeleton */}
      <div className="rounded-2xl border bg-white p-2 shadow-sm">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({
            length: 9,
          }).map((_, index) => (
            <div
              key={index}
              className="h-12 w-28 shrink-0 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>

      {/* Header skeleton */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-slate-200" />

          <div className="h-10 w-64 rounded-xl bg-slate-200" />

          <div className="h-4 w-full max-w-xl rounded bg-slate-100" />

          <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
        </div>
      </section>

      {/* Main content skeleton */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border bg-white p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-5">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-slate-100" />

                <div className="h-5 w-5 rounded bg-slate-100" />
              </div>

              <div className="space-y-3">
                <div className="h-6 w-32 rounded bg-slate-200" />

                <div className="h-4 w-full rounded bg-slate-100" />

                <div className="h-4 w-4/5 rounded bg-slate-100" />
              </div>

              <div className="h-4 w-28 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </section>

      {/* Bottom skeleton */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="animate-pulse space-y-5">
          <div className="h-7 w-48 rounded bg-slate-200" />

          <div className="h-4 w-full max-w-2xl rounded bg-slate-100" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}