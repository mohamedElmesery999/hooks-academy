'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Video, MessageSquareQuote } from 'lucide-react'
import {
  useCreateHomeTestimonial,
  useCreateHomeVideo,
  useDeleteHomeTestimonial,
  useDeleteHomeVideo,
  useHomeTestimonials,
  useHomeVideos,
} from '@/lib/hooks/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'

export function ContentManager() {
  const { data: videos = [], isLoading: videosLoading } = useHomeVideos()
  const { data: testimonials = [], isLoading: testimonialsLoading } = useHomeTestimonials()

  const createVideo = useCreateHomeVideo()
  const deleteVideo = useDeleteHomeVideo()
  const createTestimonial = useCreateHomeTestimonial()
  const deleteTestimonial = useDeleteHomeTestimonial()

  const [videoTitle, setVideoTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoError, setVideoError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [role, setRole] = useState('طالبة')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [testimonialError, setTestimonialError] = useState<string | null>(null)

  const [successOpen, setSuccessOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [pendingDeleteVideo, setPendingDeleteVideo] = useState<{ id: string; title: string } | null>(
    null,
  )
  const [pendingDeleteTestimonial, setPendingDeleteTestimonial] = useState<{
    id: string
    name: string
  } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setSuccessOpen(true)
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setVideoError(null)

    try {
      await createVideo.mutateAsync({ title: videoTitle, url: videoUrl })
      setVideoTitle('')
      setVideoUrl('')
      showSuccess('تم إضافة الفيديو بنجاح')
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'فشل إضافة الفيديو')
    }
  }

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    setTestimonialError(null)

    if (!imageFile) {
      setTestimonialError('اختر صورة الرأي')
      return
    }

    try {
      const form = new FormData()
      form.append('name', name)
      form.append('role', role)
      form.append('image', imageFile)
      await createTestimonial.mutateAsync(form)
      setName('')
      setRole('طالبة')
      setImageFile(null)
      ;(e.target as HTMLFormElement).reset()
      showSuccess('تم الإضافة بنجاح')
    } catch (err) {
      setTestimonialError(err instanceof Error ? err.message : 'فشل إضافة الرأي')
    }
  }

  const confirmDeleteVideo = async () => {
    if (!pendingDeleteVideo) return
    setDeleting(true)
    try {
      await deleteVideo.mutateAsync(pendingDeleteVideo.id)
      setPendingDeleteVideo(null)
    } finally {
      setDeleting(false)
    }
  }

  const confirmDeleteTestimonial = async () => {
    if (!pendingDeleteTestimonial) return
    setDeleting(true)
    try {
      await deleteTestimonial.mutateAsync(pendingDeleteTestimonial.id)
      setPendingDeleteTestimonial(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-5">
        <div className="flex items-center gap-2">
          <Video size={18} className="text-primary-400" />
          <h3 className="text-lg font-semibold text-white">فيديوهات الصفحة الرئيسية</h3>
        </div>

        <form onSubmit={handleAddVideo} className="space-y-3">
          <Input
            id="video-title"
            label="عنوان الفيديو"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="مثال: درس HTML"
            required
          />
          <Input
            id="video-url"
            label="رابط يوتيوب"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtu.be/... أو https://www.youtube.com/watch?v=..."
            dir="ltr"
            className="text-left"
            required
          />
          {videoError && <p className="text-sm text-red-400">{videoError}</p>}
          <Button type="submit" loading={createVideo.isPending} className="w-full">
            <Plus size={16} />
            إضافة فيديو
          </Button>
        </form>

        <div className="space-y-2 border-t border-dark-border pt-4">
          {videosLoading ? (
            <p className="text-sm text-slate-500">جاري التحميل...</p>
          ) : videos.length === 0 ? (
            <p className="text-sm text-slate-500">لا توجد فيديوهات بعد</p>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-dark-border bg-dark px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{video.title}</p>
                  <p className="truncate text-xs text-slate-500" dir="ltr">
                    {video.youtubeId}
                    {video.startSeconds ? ` · t=${video.startSeconds}s` : ''}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => setPendingDeleteVideo({ id: video.id, title: video.title })}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="space-y-5">
        <div className="flex items-center gap-2">
          <MessageSquareQuote size={18} className="text-primary-400" />
          <h3 className="text-lg font-semibold text-white">صور آراء الطلاب</h3>
        </div>

        <form onSubmit={handleAddTestimonial} className="space-y-3">
          <Input
            id="testimonial-name"
            label="الاسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم الطالب/ة"
            required
          />
          <Input
            id="testimonial-role"
            label="الصفة"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="طالبة"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="testimonial-image" className="text-sm font-medium text-slate-300">
              صورة الرأي (سكرين واتساب)
            </label>
            <input
              id="testimonial-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-xl border border-dark-border bg-dark px-3 py-2 text-sm text-slate-300 file:me-3 file:rounded-lg file:border-0 file:bg-primary-500/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-400"
              required
            />
          </div>
          {testimonialError && <p className="text-sm text-red-400">{testimonialError}</p>}
          <Button type="submit" loading={createTestimonial.isPending} className="w-full">
            <Plus size={16} />
            إضافة رأي
          </Button>
        </form>

        <div className="grid grid-cols-2 gap-3 border-t border-dark-border pt-4 sm:grid-cols-3">
          {testimonialsLoading ? (
            <p className="col-span-full text-sm text-slate-500">جاري التحميل...</p>
          ) : testimonials.length === 0 ? (
            <p className="col-span-full text-sm text-slate-500">لا توجد آراء بعد</p>
          ) : (
            testimonials.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-dark-border bg-dark"
              >
                <div className="relative aspect-[3/4]">
                  <Image src={item.imageUrl} alt={item.alt ?? item.name} fill className="object-cover object-top" />
                </div>
                <div className="flex items-center justify-between gap-2 px-2 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-white">{item.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{item.role}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => setPendingDeleteTestimonial({ id: item.id, name: item.name })}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal
        open={!!pendingDeleteVideo}
        onClose={() => !deleting && setPendingDeleteVideo(null)}
        title="تأكيد حذف الفيديو"
        description={
          pendingDeleteVideo
            ? `هل أنت متأكد من حذف الفيديو "${pendingDeleteVideo.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : undefined
        }
        confirmLabel="حذف الفيديو"
        variant="danger"
        loading={deleting}
        onConfirm={() => void confirmDeleteVideo()}
      />

      <Modal
        open={!!pendingDeleteTestimonial}
        onClose={() => !deleting && setPendingDeleteTestimonial(null)}
        title="تأكيد حذف الرأي"
        description={
          pendingDeleteTestimonial
            ? `هل أنت متأكد من حذف رأي "${pendingDeleteTestimonial.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : undefined
        }
        confirmLabel="حذف الرأي"
        variant="danger"
        loading={deleting}
        onConfirm={() => void confirmDeleteTestimonial()}
      />

      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onConfirm={() => setSuccessOpen(false)}
        title="تم بنجاح"
        description={successMessage}
        confirmLabel="حسناً"
        cancelLabel={null}
        variant="success"
      />
    </div>
  )
}
