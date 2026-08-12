import { mkdir, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { put, del } from '@vercel/blob'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'testimonials')

// Vercel's serverless functions run on a read-only filesystem, so uploaded
// files must go to Vercel Blob storage there. Locally (no token configured)
// we fall back to writing straight into `public/uploads` for convenience.
const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export async function saveTestimonialImage(file: File) {
  const ext = guessExtension(file.type, file.name)
  const filename = `${randomUUID()}${ext}`

  if (useBlobStorage) {
    const blob = await put(`testimonials/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
    })
    return blob.url
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(path.join(UPLOAD_DIR, filename), bytes)

  return `/uploads/testimonials/${filename}`
}

export async function deleteUploadedFile(imageUrl: string) {
  if (useBlobStorage && /^https?:\/\//.test(imageUrl)) {
    try {
      await del(imageUrl)
    } catch {
      /* ignore missing/foreign blob */
    }
    return
  }

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
