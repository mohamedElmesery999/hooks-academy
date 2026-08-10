import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { createVideoSchema } from '@/lib/validations/content'
import { extractYouTubeId, extractYouTubeStartSeconds } from '@/lib/youtube'

export async function GET() {
  try {
    const videos = await prisma.home_videos.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonResponse(videos)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const body = await request.json()
    const data = createVideoSchema.parse(body)
    const youtubeId = extractYouTubeId(data.url)

    if (!youtubeId) {
      return errorResponse('رابط يوتيوب غير صالح', 400)
    }

    const startFromUrl = extractYouTubeStartSeconds(data.url)
    const count = await prisma.home_videos.count()

    const video = await prisma.home_videos.create({
      data: {
        title: data.title,
        youtubeId,
        startSeconds: data.startSeconds ?? startFromUrl,
        sortOrder: count,
      },
    })

    return jsonResponse(video, 201)
  } catch (err) {
    return handleApiError(err)
  }
}
