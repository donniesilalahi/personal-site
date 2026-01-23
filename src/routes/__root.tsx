import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

const siteTitle = 'Donnie Silalahi'
const siteDescription = 'Product Builder, Growth Marketer and Operations Leader'
const siteUrl = 'https://donniesilalahi.com'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteTitle,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      // Open Graph
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: siteUrl,
      },
      {
        property: 'og:title',
        content: siteTitle,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:image',
        content: `${siteUrl}/opengraph.webp`,
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:url',
        content: siteUrl,
      },
      {
        name: 'twitter:title',
        content: siteTitle,
      },
      {
        name: 'twitter:description',
        content: siteDescription,
      },
      {
        name: 'twitter:image',
        content: `${siteUrl}/opengraph.webp`,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/webp',
        href: '/favicon.webp',
      },
      {
        rel: 'apple-touch-icon',
        href: '/favicon.webp',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
