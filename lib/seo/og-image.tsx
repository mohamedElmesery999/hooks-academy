import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { siteConfig } from '@/lib/seo/site'

export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = 'image/png'

type OgImageOptions = {
  title?: string
  subtitle?: string
  description?: string
}

export async function createOgImage({
  title = siteConfig.name,
  subtitle = siteConfig.nameAr,
  description = siteConfig.descriptionEn,
}: OgImageOptions = {}) {
  const logoData = await readFile(join(process.cwd(), 'public/logo.png'), 'base64')
  const logoSrc = `data:image/png;base64,${logoData}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b0e14 0%, #12161f 45%, #0b0e14 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,38,211,0.2) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 64px',
            borderRadius: 32,
            border: '2px solid rgba(56,189,248,0.3)',
            background: 'rgba(18,22,31,0.85)',
          }}
        >
          <img
            src={logoSrc}
            alt={siteConfig.name}
            width={160}
            height={160}
            style={{
              borderRadius: 32,
              marginBottom: 28,
              objectFit: 'cover',
            }}
          />

          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: 12,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 34,
              color: '#38bdf8',
              marginBottom: 18,
              fontWeight: 600,
            }}
          >
            {subtitle}
          </div>

          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: 820,
              lineHeight: 1.45,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    { ...ogImageSize },
  )
}

export function getOgImageUrl(_path = '/') {
  return '/opengraph-image'
}
