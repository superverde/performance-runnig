// Mostrado imediatamente enquanto a homepage carrega no servidor
// Evita o ecrã vazio durante o cold start da Vercel
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Hero skeleton */}
      <div className="relative flex-1 min-h-screen bg-[#0a0a0a] flex flex-col justify-center px-8 lg:px-20">
        <div className="max-w-7xl mx-auto w-full pt-28 pb-24">
          {/* Badge */}
          <div className="h-6 w-48 rounded-full bg-white/5 mb-10 animate-pulse" />
          {/* Headline */}
          <div className="space-y-3 mb-8">
            <div className="h-16 lg:h-24 w-3/4 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-16 lg:h-24 w-2/3 rounded-lg bg-[#00C896]/10 animate-pulse" />
            <div className="h-16 lg:h-24 w-1/2 rounded-lg bg-[#00C896]/15 animate-pulse" />
          </div>
          {/* Subtitle */}
          <div className="h-4 w-96 rounded bg-white/5 mb-3 animate-pulse" />
          <div className="h-4 w-72 rounded bg-white/5 mb-10 animate-pulse" />
          {/* CTAs */}
          <div className="flex gap-4 mb-20">
            <div className="h-12 w-44 rounded-full bg-[#00C896]/20 animate-pulse" />
            <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse" />
          </div>
          {/* Stats */}
          <div className="border-t border-white/5 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-14 w-24 rounded-lg bg-[#00C896]/10 mb-2 animate-pulse" />
                <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
