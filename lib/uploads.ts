import { mkdir, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'testimonials')

export async function saveTestimonialImage(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = guessExtension(file.type, file.name)
  const filename = `${randomUUID()}${ext}`

  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(path.join(UPLOAD_DIR, filename), bytes)

  return `/uploads/testimonials/${filename}`
}

export async function deleteUploadedFile(imageUrl: string) {
  if (!imageUrl.startsWith('/uploads/testimonials/')) return

  const filename = path.basename(imageUrl)
  try {
    await unlink(path.join(UPLOAD_DIR, filename))
  } catch {
    /* ignore missing file */
  }
}

function guessExtension(mime: string, name: string) {
  if (mime === 'image/png') return '.png'
  if (mime === 'image/jpeg' || mime === 'image/jpg') return '.jpg'
  if (mime === 'image/webp') return '.webp'
  if (mime === 'image/gif') return '.gif'

  const fromName = path.extname(name)
  return fromName || '.png'
}
