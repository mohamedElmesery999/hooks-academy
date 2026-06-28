import { getSiteUrl, siteConfig } from '@/lib/seo/site'

export function JsonLd() {
  const siteUrl = getSiteUrl()

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteConfig.name,
    alternateName: siteConfig.nameAr,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    inLanguage: siteConfig.language,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'Children aged 8-15',
    },
    sameAs: [],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: `${siteUrl}/logo.png`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
