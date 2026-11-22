import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { saveWorkImage } from '@/lib/uploads'

export async function GET() {
  try {
    const works = await prisma.student_works.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonResponse(works)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const form = await request.formData()
    const name = String(form.get('name') ?? '').trim()
    const title = String(form.get('title') ?? '').trim()
    const liveUrl = String(form.get('liveUrl') ?? '').trim()
    const file = form.get('image')

    if (name.length < 2) {
      return errorResponse('اسم الطالب مطلوب', 400)
    }

    if (!(file instanceof File) || file.size === 0) {
      return errorResponse('صورة العمل مطلوبة', 400)
    }

    if (!file.type.startsWith('image/')) {
      return errorResponse('الملف يجب أن يكون صورة', 400)
    }

    if (file.size > 5 * 1024 * 1024) {
      return errorResponse('حجم الصورة كبير جدًا (الحد 5MB)', 400)
    }

    if (liveUrl && !/^https?:\/\//i.test(liveUrl)) {
      return errorResponse('رابط الموقع يجب أن يبدأ بـ http أو https', 400)
    }

    const imageUrl = await saveWorkImage(file)
    const count = await prisma.student_works.count()

    const work = await prisma.student_works.create({
      data: {
        name,
        title: title || null,
        liveUrl: liveUrl || null,
        imageUrl,
        sortOrder: count,
      },
    })

    return jsonResponse(work, 201)
  } catch (err) {
    return handleApiError(err)
  }
}
