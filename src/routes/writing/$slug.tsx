import React from 'react'
import {
  Link,
  createFileRoute,
  notFound,
  useSearch,
} from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { PageLayout } from '@/components/page-layout'
import { DottedLinesOverlay } from '@/components/postcard/postcard-frame'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import {
  GROWTH_STAGE_ICONS,
  GROWTH_STAGE_LABELS,
  getTopicBySlug,
  getWritingBySlug,
} from '@/lib/writings'

type SearchParams = {
  from?: 'home' | 'writings'
}

export const Route = createFileRoute('/writing/$slug')({
  component: WritingPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      from:
        search.from === 'home' || search.from === 'writings'
          ? search.from
          : undefined,
    }
  },
  loader: ({ params }) => {
    const writing = getWritingBySlug(params.slug)
    if (!writing) {
      throw notFound()
    }
    const topic = getTopicBySlug(writing.topic)
    return { writing, topic }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.writing) {
      return { meta: [{ title: 'Writing | Donnie Silalahi' }] }
    }
    const { writing } = loaderData
    const siteUrl = 'https://donniesilalahi.com'
    return {
      meta: [
        { title: writing.seoTitle || `${writing.title} | Donnie Silalahi` },
        {
          name: 'description',
          content: writing.seoDescription || writing.description,
        },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${siteUrl}/writing/${writing.slug}` },
        {
          property: 'og:title',
          content: writing.seoTitle || writing.title,
        },
        {
          property: 'og:description',
          content: writing.seoDescription || writing.description,
        },
        {
          property: 'og:image',
          content: writing.seoImage || `${siteUrl}/opengraph.webp`,
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: `${siteUrl}/writing/${writing.slug}` },
        {
          name: 'twitter:title',
          content: writing.seoTitle || writing.title,
        },
        {
          name: 'twitter:description',
          content: writing.seoDescription || writing.description,
        },
        {
          name: 'twitter:image',
          content: writing.seoImage || `${siteUrl}/opengraph.webp`,
        },
      ],
    }
  },
})

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function WritingPage() {
  const { writing, topic } = Route.useLoaderData()
  const { from } = useSearch({ from: '/writing/$slug' })
  const [cornerLift, setCornerLift] = React.useState(0)

  const backLink = from === 'writings' ? '/writings' : '/'

  return (
    <PageLayout className="bg-white font-inter">
      <article className="flex flex-col gap-8">
        {/* Back Button - Outside Card */}
        <Link
          to={backLink}
          className="w-fit -ml-2 px-2 py-1 text-sm hover:bg-muted rounded-md transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </Link>

        {/* Main Card with Folded Corner Effect */}
        <div
          className="relative group"
          onMouseEnter={() => setCornerLift(1)}
          onMouseLeave={() => setCornerLift(0)}
        >
          {/* Main card - note: top-right corner has no border-radius */}
          <div
            className="relative bg-white border border-neutral-200"
            style={{ borderRadius: '8px 0 8px 8px' }}
          >
            {/* Dotted lines background overlay */}
            <DottedLinesOverlay />

            {/* Folded corner - curved fold showing paper backside */}
            <div
              className="absolute top-0 right-0 pointer-events-none transition-all duration-300"
              style={{
                width: cornerLift ? '28px' : '20px',
                height: cornerLift ? '28px' : '20px',
                background: 'linear-gradient(135deg, #e5e5e5 0%, #d5d5d5 100%)',
                borderBottomLeftRadius: '100%',
                boxShadow: '-2px 2px 3px rgba(0,0,0,0.08)',
              }}
            />

            {/* Header Section */}
            <div className="relative px-6 py-8 md:px-8">
              <h1 className="text-3xl font-black text-foreground font-bricolage mb-4">
                {writing.title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <time dateTime={writing.publishedAt}>
                  {formatFullDate(writing.publishedAtParsed)}
                </time>
                <span>·</span>
                {topic && (
                  <Link
                    to="/topic/$slug"
                    params={{ slug: topic.slug }}
                    className="hover:text-foreground transition-colors"
                  >
                    {topic.name}
                  </Link>
                )}
                <span>·</span>
                <div className="flex items-center gap-1">
                  <img
                    src={GROWTH_STAGE_ICONS[writing.growthStage]}
                    alt={writing.growthStage}
                    className="size-4"
                  />
                  <span>{GROWTH_STAGE_LABELS[writing.growthStage]}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative h-px bg-neutral-200" />

            {/* Content Section */}
            <div className="relative px-6 py-8 md:px-8">
              <MarkdownRenderer
                content={writing.content}
                className="prose prose-neutral max-w-none"
              />
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
