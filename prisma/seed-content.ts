import 'dotenv/config'
import { copyFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../lib/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const videos = [
  {
    title: 'بودكاست مع مؤسس الأكاديمية م. محمد المسيري',
    youtubeId: 'Hk0zCkO8MCM',
    startSeconds: 287,
    sortOrder: 0,
  },
  {
    title: 'قبل ما تتعلّم البرمجة… لازم تفهم HTML!',
    youtubeId: 'AwgCMps8Ij4',
    startSeconds: null,
    sortOrder: 1,
  },
]

const testimonials = [
  { name: 'سندس جمال', role: 'طالبة', file: 'sondos-whatsapp.png', sortOrder: 0 },
  { name: 'بطة', role: 'طالبة', file: 'batta-whatsapp.png', sortOrder: 1 },
  { name: 'خلود', role: 'طالبة', file: 'khloud-whatsapp.png', sortOrder: 2 },
  { name: 'دعاء رشوان', role: 'طالبة', file: 'doaa-whatsapp.png', sortOrder: 3 },
  { name: 'نور محمد', role: 'طالبة', file: 'nour-whatsapp.png', sortOrder: 4 },
  { name: 'جنى', role: 'طالبة', file: 'jana-whatsapp.png', sortOrder: 5 },
]

async function ensureUploadCopy(filename: string) {
  const src = path.join(process.cwd(), 'public', 'testimonials', filename)
  const destDir = path.join(process.cwd(), 'public', 'uploads', 'testimonials')
  const dest = path.join(destDir, filename)

  await mkdir(destDir, { recursive: true })

  try {
    await access(dest)
  } catch {
    await copyFile(src, dest)
  }

  return `/uploads/testimonials/${filename}`
}

async function main() {
  const videoCount = await prisma.home_videos.count()
  if (videoCount === 0) {
    await prisma.home_videos.createMany({ data: videos })
    console.log(`Seeded ${videos.length} videos`)
  }

  const testimonialCount = await prisma.home_testimonials.count()
  if (testimonialCount === 0) {
    for (const item of testimonials) {
      const imageUrl = await ensureUploadCopy(item.file)
      await prisma.home_testimonials.create({
        data: {
          name: item.name,
          role: item.role,
          imageUrl,
          alt: `رأي ${item.name} عبر واتساب`,
          sortOrder: item.sortOrder,
        },
      })
    }
    console.log(`Seeded ${testimonials.length} testimonials`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
