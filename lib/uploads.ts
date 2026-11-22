import { mkdir, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { put, del } from '@vercel/blob'

// Vercel's serverless functions run on a read-only filesystem, so uploaded
// files must go to Vercel Blob storage there. Locally (no token configured)
// we fall back to writing straight into `public/uploads` for convenience.
const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

function uploadDir(folder: string) {
  return path.join(process.cwd(), 'public', 'uploads', folder)
}

/** Save an uploaded image into the given `public/uploads/<folder>` (or Blob). */
export async function saveImage(file: File, folder: string) {
  const ext = guessExtension(file.type, file.name)
  const filename = `${randomUUID()}${ext}`

  if (useBlobStorage) {
    const blob = await put(`${folder}/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
    })
    return blob.url
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  await mkdir(uploadDir(folder), { recursive: true })
  await writeFile(path.join(uploadDir(folder), filename), bytes)

  return `/uploads/${folder}/${filename}`
}

/** Backwards-compatible helper for testimonial screenshots. */
export function saveTestimonialImage(file: File) {
  return saveImage(file, 'testimonials')
}

export function saveWorkImage(file: File) {
  return saveImage(file, 'works')
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

  const match = imageUrl.match(/^\/uploads\/([^/]+)\/(.+)$/)
  if (!match) return

  const [, folder, filename] = match
  try {
    await unlink(path.join(uploadDir(folder), path.basename(filename)))
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
