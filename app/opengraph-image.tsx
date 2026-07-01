import { siteConfig } from '@/lib/seo/site'
import { createOgImage, ogImageContentType, ogImageSize } from '@/lib/seo/og-image'

export const alt = `${siteConfig.name} - ${siteConfig.nameAr}`
export const size = ogImageSize
export const contentType = ogImageContentType

export default async function Image() {
  return createOgImage()
}
