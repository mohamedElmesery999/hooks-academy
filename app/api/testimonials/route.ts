import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { saveTestimonialImage } from '@/lib/uploads'

export async function GET() {
  try {
    const testimonials = await prisma.home_testimonials.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonResponse(testimonials)
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
    const role = String(form.get('role') ?? 'طالبة').trim() || 'طالبة'
    const alt = String(form.get('alt') ?? '').trim()
    const file = form.get('image')

    if (name.length < 2) {
      return errorResponse('الاسم مطلوب', 400)
    }

    if (!(file instanceof File) || file.size === 0) {
      return errorResponse('صورة الرأي مطلوبة', 400)
    }

    if (!file.type.startsWith('image/')) {
      return errorResponse('الملف يجب أن يكون صورة', 400)
    }

    if (file.size > 5 * 1024 * 1024) {
      return errorResponse('حجم الصورة كبير جدًا (الحد 5MB)', 400)
    }

    const imageUrl = await saveTestimonialImage(file)
    const count = await prisma.home_testimonials.count()

    const testimonial = await prisma.home_testimonials.create({
      data: {
        name,
        role,
        imageUrl,
        alt: alt || `رأي ${name} عبر واتساب`,
        sortOrder: count,
      },
    })

    return jsonResponse(testimonial, 201)
  } catch (err) {
    return handleApiError(err)
  }
}
