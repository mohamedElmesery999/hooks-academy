'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

type YouTubeEmbedProps = {
  youtubeId: string
  title: string
  startSeconds?: number
}

export function YouTubeEmbed({ youtubeId, title, startSeconds }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const thumbnail = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`

  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
  })
  if (startSeconds && startSeconds > 0) {
    params.set('start', String(startSeconds))
  }

  return (
    <div className="relative aspect-video overflow-hidden bg-dark">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 w-full"
          aria-label={`تشغيل: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/35 transition-colors group-hover:bg-dark/45" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-105">
            <Play size={28} fill="currentColor" className="ms-0.5" />
          </span>
        </button>
      )}
    </div>
  )
}
