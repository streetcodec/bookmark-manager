'use client'

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bookmark } from '@/types/bookmark'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface BookmarkListRef {
    refresh: () => Promise<void>
}

const BookmarkList = forwardRef<BookmarkListRef>((props, ref) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const supabase = createClient()

    // Expose refresh method to parent component
    useImperativeHandle(ref, () => ({
        refresh: fetchBookmarks
    }))

    useEffect(() => {
        fetchBookmarks()

        // Set up real-time subscription
        const channel: RealtimeChannel = supabase
            .channel('bookmarks-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => [payload.new as Bookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) => current.filter((b) => b.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchBookmarks = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                setError('You must be logged in')
                setLoading(false)
                return
            }

            const { data, error: fetchError } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            setBookmarks(data || [])
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookmarks')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error: deleteError } = await supabase.from('bookmarks').delete().eq('id', id)

            if (deleteError) throw deleteError

            // Optimistic update - remove from UI immediately
            setBookmarks((current) => current.filter((b) => b.id !== id))
        } catch (err: any) {
            setError(err.message || 'Failed to delete bookmark')
            // Refetch to restore state if delete failed
            fetchBookmarks()
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-white/40 font-display font-medium tracking-wide">Accessing Database...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 glass rounded-2xl flex items-center gap-4 text-accent border-accent/20 animate-fade-in shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                <div className="p-3 rounded-xl bg-accent/10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <p className="font-bold uppercase text-[10px] tracking-widest opacity-60">Critical Error</p>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-24 glass rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/[0.03] border border-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                        <svg
                            className="w-10 h-10 text-white/20 group-hover:text-primary/40 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight">Your vault is empty</h3>
                    <p className="text-white/40 text-sm max-w-[240px] mx-auto leading-relaxed">Start organizing your digital library by adding your first link.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group relative p-5 glass rounded-2xl hover:bg-white/[0.05] border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] active:scale-[0.995]"
                >
                    <div className="flex items-start justify-between gap-5">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 rounded-md bg-white/5 border border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 11-5.656-5.656l-1.102 1.101" />
                                    </svg>
                                </div>
                                <h3 className="font-display font-bold text-white text-lg truncate tracking-tight">
                                    {bookmark.title}
                                </h3>
                            </div>
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary/70 hover:text-primary text-sm truncate block transition-colors mb-4 pl-0.5"
                            >
                                {bookmark.url}
                            </a>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                                    Stored on
                                </span>
                                <span className="text-[10px] font-bold text-white/30 group-hover:text-white/50 transition-colors bg-white/5 px-2 py-0.5 rounded-md">
                                    {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="flex-shrink-0 p-3 text-white/20 hover:text-accent hover:bg-accent/10 rounded-xl transition-all duration-300 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                            title="Remove Archive"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                    {/* Subtle Gradient Line on Hover */}
                    <div className="absolute bottom-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
            ))}
        </div>
    )
})

BookmarkList.displayName = 'BookmarkList'

export default BookmarkList

