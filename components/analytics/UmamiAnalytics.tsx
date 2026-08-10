import Script from 'next/script'

/**
 * Loads Umami tracker when both env vars are set.
 * Use Umami Cloud or any hosted Umami instance.
 */
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL

  if (!websiteId || !scriptUrl) return null

  return (
    <Script
      async
      defer
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}
