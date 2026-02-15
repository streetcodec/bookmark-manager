'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AuthButton from '@/components/AuthButton'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList, { type BookmarkListRef } from '@/components/BookmarkList'
import type { Session } from '@supabase/supabase-js'

export default function Dashboard() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const bookmarkListRef = useRef<BookmarkListRef>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                router.push('/')
                return
            }

            setSession(session)
            setLoading(false)
        }

        checkSession()
    }, [router, supabase.auth])

    const handleBookmarkAdded = () => {
        // Refresh the bookmark list when a new bookmark is added
        bookmarkListRef.current?.refresh()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center p-[1px] group-hover:scale-110 transition-transform duration-500">
                                    <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                                        <svg
                                            className="w-7 h-7 text-white"
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
                                <div>
                                    <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                                        Vault
                                    </h1>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
                                        Bookmark Manager
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <AuthButton session={session} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center w-full px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl items-start justify-center">
                        {/* Add Bookmark Section */}
                        <div className="w-full lg:w-[400px] shrink-0 flex flex-col p-4">
                            <div className="sticky top-[100px]  flex flex-col p-4">
                                <div className="glass rounded-2xl p-8 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />

                                    <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </div>
                                        Fast Capture
                                    </h2>
                                    <BookmarkForm onBookmarkAdded={handleBookmarkAdded} />
                                </div>
                                <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <p className="text-xs text-white/40 leading-relaxed">
                                        Store your research, articles, and inspirations. Everything is synced in real-time across your devices.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bookmarks List Section */}
                        <div className="flex-1 w-full min-w-0">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                    Your Library
                                    <span className="text-sm font-normal text-white/40 ml-2 px-2 py-0.5 rounded-full bg-white/5">
                                        Saved Links
                                    </span>
                                </h2>
                                <div className="flex gap-2">
                                    {/* Placeholder for future filter/sort buttons */}
                                    <div className="w-10 h-10 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <BookmarkList ref={bookmarkListRef} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

