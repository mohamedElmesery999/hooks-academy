import type { MetadataRoute } from 'next'
import { getSiteUrl, publicRoutes } from '@/lib/seo/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()

  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    images: path === '/' ? [`${siteUrl}/logo.png`] : undefined,
  }))
}
