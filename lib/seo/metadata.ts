import type { Metadata } from 'next'
import { getOgImageUrl } from './og-image'
import { getSiteUrl, siteConfig } from './site'

type PageMetadataOptions = {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const siteUrl = getSiteUrl()
  const canonicalUrl = `${siteUrl}${path}`

  const resolvedTitle = title
    ? { absolute: `${title} | ${siteConfig.name}` }
    : {
        default: `${siteConfig.name} | ${siteConfig.nameAr}`,
        template: `%s | ${siteConfig.name}`,
      }

  const pageTitle =
    typeof resolvedTitle === 'object' && 'absolute' in resolvedTitle
      ? resolvedTitle.absolute
      : resolvedTitle.default

  const ogImageUrl = getOgImageUrl(path)
  const ogImageAlt = `${siteConfig.name} - ${siteConfig.nameAr}`

  return {
    metadataBase: new URL(siteUrl),
    title: resolvedTitle,
    description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.name, url: siteUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    category: 'education',
  }
}

export const rootMetadata = createMetadata({
  title: undefined,
  description: siteConfig.description,
  path: '/',
})
