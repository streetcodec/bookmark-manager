'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BookmarkForm({ onBookmarkAdded }: { onBookmarkAdded?: () => void }) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Validate URL
            try {
                new URL(url)
            } catch {
                setError('Please enter a valid URL')
                setLoading(false)
                return
            }

            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                setError('You must be logged in to add bookmarks')
                setLoading(false)
                return
            }

            const { error: insertError } = await supabase
                .from('bookmarks')
                .insert({
                    user_id: user.id,
                    url,
                    title,
                })
                .select()
                .single()

            if (insertError) throw insertError

            // Reset form
            setUrl('')
            setTitle('')

            // Call the callback if provided (for optimistic UI update)
            if (onBookmarkAdded) {
                onBookmarkAdded()
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to add bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-5">
                <div className="group/input">
                    <label htmlFor="url" className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-primary transition-colors">
                        Resource URL
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://framer.com/showcase"
                            required
                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 font-sans"
                        />
                        <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
                    </div>
                </div>
                <div className="group/input">
                    <label htmlFor="title" className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-secondary transition-colors">
                        Entry Title
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Design Inspiration 2024"
                            required
                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300 font-sans"
                        />
                        <div className="absolute inset-0 rounded-xl bg-secondary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm flex items-center gap-3 animate-fade-in shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full relative group/btn overflow-hidden rounded-xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                <div className="relative py-4 bg-background/90 group-hover/btn:bg-transparent transition-colors rounded-[11px] flex items-center justify-center gap-3">
                    {loading ? (
                        <span className="flex items-center gap-3 text-white font-bold tracking-tight">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        <span className="text-white font-bold tracking-tight flex items-center gap-2">
                            Archive Bookmark
                            <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    )}
                </div>
            </button>
        </form>
    )
}
