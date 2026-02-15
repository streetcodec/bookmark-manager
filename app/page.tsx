import { createClient } from '@/lib/supabase/server'
import AuthButton from '@/components/AuthButton'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center space-y-12">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center p-1 rounded-[2rem] bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl animate-fade-in">
            <div className="w-24 h-24 bg-background rounded-[1.8rem] flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
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

          {/* Heading */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter">
              Archive your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Web.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto font-medium leading-relaxed">
              Experience the minimal, high-performance vault for your digital library. Beautifully organized, instantly synced.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="group p-6 glass rounded-2xl border-white/5 hover:border-white/10 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-white mb-2 tracking-tight transition-colors group-hover:text-primary">Omni-Sync</h3>
              <p className="text-[13px] text-white/30 leading-relaxed font-medium">Updates propagate across your global network in milliseconds.</p>
            </div>
            <div className="group p-6 glass rounded-2xl border-white/5 hover:border-white/10 transition-all duration-500">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-white mb-2 tracking-tight transition-colors group-hover:text-secondary">E2E Privacy</h3>
              <p className="text-[13px] text-white/30 leading-relaxed font-medium">Built on Postgres RLS. Your knowledge remains strictly yours.</p>
            </div>
            <div className="group p-6 glass rounded-2xl border-white/5 hover:border-white/10 transition-all duration-500">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-white mb-2 tracking-tight transition-colors group-hover:text-accent">Zero Friction</h3>
              <p className="text-[13px] text-white/30 leading-relaxed font-medium">Intelligent capture designed for focus and productivity.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8 flex flex-col items-center gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <AuthButton session={null} />
          </div>
        </div>
      </div>
    </div>
  )
}
