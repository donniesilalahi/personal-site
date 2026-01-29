import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GROWTH_STAGE_ICONS, GROWTH_STAGE_LABELS, getTopicBySlug, getWritingBySlug } from '@/lib/writings'

export const Route = createFileRoute('/writing/$slug')({
  component: WritingPage,
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

  return (
    <main className="min-h-screen bg-primitives-colors-gray-light-mode-50 flex items-center justify-center py-16">
      <article className="w-full max-w-[720px] px-4 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
            <Link to="/writings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All writings
            </Link>
          </Button>

          {/* Title and meta */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-medium text-foreground">
              {writing.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                  className="w-4 h-4"
                />
                <span>{GROWTH_STAGE_LABELS[writing.growthStage]}</span>
              </div>
            </div>

            {writing.description && (
              <p className="text-muted-foreground">{writing.description}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: writing.content
                .split('\n\n')
                .map((paragraph) => {
                  if (paragraph.startsWith('## ')) {
                    return `<h2>${paragraph.slice(3)}</h2>`
                  }
                  if (paragraph.startsWith('### ')) {
                    return `<h3>${paragraph.slice(4)}</h3>`
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph
                      .split('\n')
                      .filter((l) => l.startsWith('- '))
                      .map((l) => `<li>${l.slice(2)}</li>`)
                      .join('')
                    return `<ul>${items}</ul>`
                  }
                  return `<p>${paragraph.replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>`
                })
                .join(''),
            }}
          />
        </div>
      </article>
    </main>
  )
}
