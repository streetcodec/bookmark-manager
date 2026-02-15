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
  <div className="w-full max-w-2xl mx-auto px-6">
    <div className="glass rounded-3xl border border-white/10 p-10 md:p-12 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">

        {/* Inputs */}
        <div className="flex flex-col gap-7">

          {/* URL */}
          <div className="group/input flex flex-col gap-3">
            <label
              htmlFor="url"
              className="text-xs font-bold text-white/40 uppercase tracking-widest group-focus-within/input:text-primary transition-colors"
            >
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
                className="w-full px-6 py-5 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
          </div>

          {/* Title */}
          <div className="group/input flex flex-col gap-3">
            <label
              htmlFor="title"
              className="text-xs font-bold text-white/40 uppercase tracking-widest group-focus-within/input:text-secondary transition-colors"
            >
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
                className="w-full px-6 py-5 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-2xl bg-secondary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="p-5 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-sm flex items-center gap-3 animate-fade-in">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative group/btn overflow-hidden rounded-2xl p-[1.5px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-80 group-hover/btn:opacity-100 transition-opacity rounded-2xl" />

          <div className="relative py-5 bg-background group-hover/btn:bg-transparent transition-colors rounded-[14px] flex items-center justify-center gap-3">
            {loading ? (
              <span className="flex items-center gap-3 text-white font-bold">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="text-white font-bold tracking-tight flex items-center gap-2 text-lg">
                Archive Bookmark
                <svg
                  className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            )}
          </div>
        </button>

      </form>
    </div>
  </div>
)

}
