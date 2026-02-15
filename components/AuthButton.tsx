'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'

export default function AuthButton({ session }: { session: Session | null }) {
    const router = useRouter()
    const supabase = createClient()

    const getURL = () => {
        let url =
            process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000/')
        // Make sure to include `https://` when not localhost.
        url = url.includes('http') ? url : `https://${url}`
        // Make sure to include a trailing `/`.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
        return url
    }

    const handleSignIn = async () => {
        const redirectTo = `https://bookmark-manager-gilt-eta.vercel.app/auth/callback` // Temp fix
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
            },
        })
        if (error) {
            console.error('Error signing in:', error.message)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    if (session) {
        return (
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="font-display font-bold text-white text-sm tracking-tight leading-tight">
                            {session.user.user_metadata?.name || session.user.email?.split('@')[0]}
                        </p>
                        <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                            Active Session
                        </p>
                    </div>
                    {session.user.user_metadata?.avatar_url && (
                        <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-full blur opacity-40 group-hover/avatar:opacity-100 transition duration-500" />
                            <img
                                src={session.user.user_metadata.avatar_url}
                                alt={session.user.user_metadata?.name || 'User'}
                                className="relative w-10 h-10 rounded-full border border-white/10 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSignOut}
                    className="p-2.5 glass rounded-xl text-white/40 hover:text-accent hover:border-accent/30 transition-all duration-300"
                    title="Terminate Session"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={handleSignIn}
            className="group relative rounded-[2rem] p-[1.5px] transition-all duration-500 hover:scale-[1.04] active:scale-[0.97]"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-[2rem] opacity-80 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-500" />

            <div className="relative min-w-[260px] px-12 py-5 bg-background rounded-[1.7rem] flex items-center justify-center gap-5">

                <svg
                    className="w-6 h-6 group-hover:rotate-[360deg] transition-transform duration-700"
                    viewBox="0 0 24 24"
                >
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>

                <span className="text-lg text-white font-display font-bold tracking-tight">
                    Access Library
                </span>

            </div>
        </button>

    )
}
