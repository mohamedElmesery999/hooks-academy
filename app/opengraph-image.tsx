import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { siteConfig } from '@/lib/seo/site'

export const alt = `${siteConfig.name} - Interactive learning for kids aged 8-15`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
            width={140}
            height={140}
            style={{
              borderRadius: 28,
              marginBottom: 32,
              objectFit: 'cover',
            }}
          />

          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: 16,
              letterSpacing: -2,
            }}
          >
            {siteConfig.name}
          </div>

          <div
            style={{
              fontSize: 32,
              color: '#38bdf8',
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            Interactive Learning Academy
          </div>

          <div
            style={{
              fontSize: 26,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: 780,
              lineHeight: 1.4,
            }}
          >
            Coding, creativity & future skills for children aged 8–15
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
