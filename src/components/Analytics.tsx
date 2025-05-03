import type { FC } from 'react'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  trackingId: string
}

const GoogleAnalytics: FC<GoogleAnalyticsProps> = ({ trackingId }) => (
  <>
    <Script strategy='afterInteractive' src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
    <Script
      id='google-analytics'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `
      }}
    />
  </>
)

export default GoogleAnalytics