'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, LayoutTemplate, ExternalLink } from 'lucide-react'
import {
  useStudentWorks,
  useCreateStudentWork,
  useDeleteStudentWork,
} from '@/lib/hooks/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'

export function WorksManager() {
  const { data: works = [], isLoading: worksLoading } = useStudentWorks()
  const createWork = useCreateStudentWork()
  const deleteWork = useDeleteStudentWork()

  const [workName, setWorkName] = useState('')
  const [workTitle, setWorkTitle] = useState('')
  const [workUrl, setWorkUrl] = useState('')
  const [workImage, setWorkImage] = useState<File | null>(null)
  const [workError, setWorkError] = useState<string | null>(null)

  const [successOpen, setSuccessOpen] = useState(false)
  const [pendingDeleteWork, setPendingDeleteWork] = useState<{ id: string; name: string } | null>(
    null,
  )
  const [deleting, setDeleting] = useState(false)

  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault()
    setWorkError(null)

    if (!workImage) {
      setWorkError('اختر صورة العمل')
      return
    }

    try {
      const form = new FormData()
      form.append('name', workName)
      if (workTitle) form.append('title', workTitle)
      if (workUrl) form.append('liveUrl', workUrl)
      form.append('image', workImage)
      await createWork.mutateAsync(form)
      setWorkName('')
      setWorkTitle('')
      setWorkUrl('')
      setWorkImage(null)
      ;(e.target as HTMLFormElement).reset()
      setSuccessOpen(true)
    } catch (err) {
      setWorkError(err instanceof Error ? err.message : 'فشل إضافة العمل')
    }
  }

  const confirmDeleteWork = async () => {
    if (!pendingDeleteWork) return
    setDeleting(true)
    try {
      await deleteWork.mutateAsync(pendingDeleteWork.id)
      setPendingDeleteWork(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-2">
        <LayoutTemplate size={18} className="text-primary-400" />
        <h3 className="text-lg font-semibold text-white">أعمال الطلاب (Portfolio)</h3>
      </div>

      <form onSubmit={handleAddWork} className="grid gap-3 sm:grid-cols-2">
        <Input
          id="work-name"
          label="اسم الطالب"
          value={workName}
          onChange={(e) => setWorkName(e.target.value)}
          placeholder="مثال: خلود سعد"
          required
        />
        <Input
          id="work-title"
          label="عنوان العمل (اختياري)"
          value={workTitle}
          onChange={(e) => setWorkTitle(e.target.value)}
          placeholder="مثال: موقع Portfolio شخصي"
        />
        <Input
          id="work-url"
          label="رابط الموقع (اختياري)"
          value={workUrl}
          onChange={(e) => setWorkUrl(e.target.value)}
          placeholder="https://..."
          dir="ltr"
          className="text-left"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="work-image" className="text-sm font-medium text-slate-300">
            صورة العمل (سكرين للموقع)
          </label>
          <input
            id="work-image"
            type="file"
            accept="image/*"
            onChange={(e) => setWorkImage(e.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-dark-border bg-dark px-3 py-2 text-sm text-slate-300 file:me-3 file:rounded-lg file:border-0 file:bg-primary-500/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-400"
            required
          />
        </div>
        {workError && <p className="text-sm text-red-400 sm:col-span-2">{workError}</p>}
        <Button type="submit" loading={createWork.isPending} className="w-full sm:col-span-2">
          <Plus size={16} />
          إضافة عمل
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-3 border-t border-dark-border pt-4 sm:grid-cols-3 lg:grid-cols-4">
        {worksLoading ? (
          <p className="col-span-full text-sm text-slate-500">جاري التحميل...</p>
        ) : works.length === 0 ? (
          <p className="col-span-full text-sm text-slate-500">لا توجد أعمال بعد</p>
        ) : (
          works.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-dark-border bg-dark"
            >
              <div className="relative aspect-[16/10]">
                <Image src={item.imageUrl} alt={item.title ?? item.name} fill className="object-cover object-top" />
              </div>
              <div className="flex items-center justify-between gap-2 px-2 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white">{item.name}</p>
                  {item.liveUrl ? (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300"
                    >
                      <ExternalLink size={10} />
                      زيارة
                    </a>
                  ) : (
                    <p className="truncate text-[11px] text-slate-500">{item.title ?? '—'}</p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => setPendingDeleteWork({ id: item.id, name: item.name })}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={!!pendingDeleteWork}
        onClose={() => !deleting && setPendingDeleteWork(null)}
        title="تأكيد حذف العمل"
        description={
          pendingDeleteWork
            ? `هل أنت متأكد من حذف عمل "${pendingDeleteWork.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : undefined
        }
        confirmLabel="حذف العمل"
        variant="danger"
        loading={deleting}
        onConfirm={() => void confirmDeleteWork()}
      />

      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onConfirm={() => setSuccessOpen(false)}
        title="تم بنجاح"
        description="تم إضافة العمل بنجاح"
        confirmLabel="حسناً"
        cancelLabel={null}
        variant="success"
      />
    </Card>
  )
}
