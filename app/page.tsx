import { createClient } from '@/lib/supabase/server'
import AuthButton from '@/components/AuthButton'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="relative min-h-screen bg-background font-sans selection:bg-primary/30 flex items-center justify-center px-6 py-16 overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center flex flex-col gap-24">

        {/* Logo */}
        <div className="flex justify-center animate-fade-in">
          <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl">
            <div className="w-28 h-28 bg-background rounded-[1.8rem] flex items-center justify-center">
              <svg
                className="w-14 h-14 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-8 animate-fade-in flex flex-col items-center text-center gap-8" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight">
            Archive your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Web.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed text-center font-medium">
            Experience the minimal, high-performance vault for your digital
            library. Beautifully organized, instantly synced.
          </p>
        </div>

        {/* Features */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
{/* Omni-Sync */}
<div className="group rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500">
  <div className="glass rounded-2xl px-8 py-8 flex flex-col items-center text-center gap-6">
    
    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
      <svg
        className="w-7 h-7 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    </div>

    <h3 className="font-display font-bold text-white text-lg tracking-tight group-hover:text-primary transition-colors">
      Omni-Sync
    </h3>

    <p className="text-sm text-white/60 leading-relaxed max-w-[260px]">
      Updates propagate across your global network in milliseconds.
    </p>

  </div>
</div>


{/* E2E Privacy */}
<div className="group rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500">
  <div className="glass rounded-2xl px-8 py-8 flex flex-col items-center text-center gap-6">
    
    <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
      <svg
        className="w-7 h-7 text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </div>

    <h3 className="font-display font-bold text-white text-lg tracking-tight group-hover:text-secondary transition-colors">
      E2E Privacy
    </h3>

    <p className="text-sm text-white/60 leading-relaxed max-w-[260px]">
      Built on Postgres RLS. Your knowledge remains strictly yours.
    </p>

  </div>
</div>


{/* Zero Friction */}
<div className="group rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500">
  <div className="glass rounded-2xl px-8 py-8 flex flex-col items-center text-center gap-6">
    
    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
      <svg
        className="w-7 h-7 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <h3 className="font-display font-bold text-white text-lg tracking-tight group-hover:text-accent transition-colors">
      Zero Friction
    </h3>

    <p className="text-sm text-white/60 leading-relaxed max-w-[260px]">
      Intelligent capture designed for focus and productivity.
    </p>

  </div>
</div>

        </div>

        {/* CTA */}
        <div
          className="pt-6 flex flex-col items-center gap-8 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="scale-125">
            <AuthButton session={null} />
          </div>
        </div>

      </div>
    </div>
  )
}
