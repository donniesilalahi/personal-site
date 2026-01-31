import React from 'react'
import { Link, createFileRoute, notFound, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

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
            from: search.from === 'home' || search.from === 'writings' ? search.from : undefined,
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

     const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
         const target = e.currentTarget
         const scrolled = target.scrollTop > 0 ? 1 : 0
         setCornerLift(scrolled)
     }

     return (
         <main className="min-h-screen bg-white flex items-center justify-center py-16 font-inter">
             <article className="w-full max-w-[720px] px-4 flex flex-col gap-8 font-inter">
                 {/* Back Button - Outside Card */}
                 <Link
                     to={backLink}
                     className="w-fit -ml-2 px-2 py-1 text-sm hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                 >
                     <ArrowLeft className="size-4" />
                     <span>Back</span>
                 </Link>

                 {/* Main Card with Lifted Corner Effect */}
                 <div
                     className="relative bg-white border border-neutral-200 rounded-lg overflow-hidden"
                     onScroll={handleScroll}
                     onMouseEnter={() => setCornerLift(1)}
                     onMouseLeave={() => setCornerLift(0)}
                 >
                     {/* Lifted Corner Effect */}
                     <div
                         className="absolute top-0 right-0 w-8 h-8 transition-all duration-300"
                         style={{
                             transform: `translateY(-${2 + cornerLift * 3}px) translateX(${2 + cornerLift * 3}px)`,
                         }}
                     >
                         <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-gray-300" />
                     </div>

                     {/* Header Section */}
                     <div className="px-6 py-8 md:px-8">
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
                     <div className="h-px bg-neutral-200" />

                     {/* Content Section */}
                     <div className="px-6 py-8 md:px-8">
                         <div className="relative w-full">
                             <MarkdownRenderer
                                 content={writing.content}
                                 className="prose prose-neutral max-w-none"
                             />
                             {/* Dotted lines overlay */}
                             <DottedLinesOverlay />
                         </div>
                     </div>
                 </div>
             </article>
         </main>
     )
     }
