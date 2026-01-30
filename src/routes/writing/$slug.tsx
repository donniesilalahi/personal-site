import { Link, createFileRoute, notFound, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { PostcardFrame } from '@/components/postcard/postcard-frame'
import { Button } from '@/components/ui/button'
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

    const backLink = from === 'writings' ? '/writings' : '/'

    return (
        <main className="min-h-screen bg-primitives-colors-gray-light-mode-50 flex items-center justify-center py-16 font-inter">
            <article className="w-full max-w-[720px] px-4 flex flex-col gap-8 font-inter">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
                        <Link to={backLink} className="flex items-center gap-2">
                            <ArrowLeft className="size-4" />
                            <span>Kembali</span>
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
                                    className="size-4"
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
                <PostcardFrame className="bg-white">
                    <div className="prose prose-neutral max-w-none text-sm leading-relaxed font-inter">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-3xl text-muted-foreground font-normal mt-6 mb-3 first:mt-0 font-inter">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl text-muted-foreground font-normal mt-6 mb-3 first:mt-0 font-inter">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl text-muted-foreground font-normal mt-6 mb-3 first:mt-0 font-inter">
                                        {children}
                                    </h3>
                                ),
                                h4: ({ children }) => (
                                    <h4 className="text-lg text-muted-foreground font-normal mt-6 mb-3 first:mt-0 font-inter">
                                        {children}
                                    </h4>
                                ),
                                h5: ({ children }) => (
                                    <h5 className="text-base text-muted-foreground font-normal mt-6 mb-3 first:mt-0 font-inter">
                                        {children}
                                    </h5>
                                ),
                                h6: ({ children }) => (
                                    <h6 className="text-sm text-muted-foreground font-normal mt-6 mb-3 first:mt-0 font-inter">
                                        {children}
                                    </h6>
                                ),
                                p: ({ children }) => (
                                    <p className="text-muted-foreground my-2 font-inter">{children}</p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc pl-6 my-3 space-y-1 font-inter">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal pl-6 my-3 space-y-1 font-inter">{children}</ol>
                                ),
                                li: ({ children }) => (
                                    <li className="text-muted-foreground font-inter">{children}</li>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground my-3 font-inter">
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ className, children }) => {
                                    return className ? (
                                        <code className="block bg-muted-foreground/10 text-muted-foreground p-4 rounded-lg overflow-x-auto text-xs my-3 font-inter">
                                            {children}
                                        </code>
                                    ) : (
                                        <code className="bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded text-xs font-inter">
                                            {children}
                                        </code>
                                    )
                                },
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        className="text-primary hover:underline font-inter"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                strong: ({ children }) => (
                                    <strong className="text-foreground font-semibold font-inter">
                                        {children}
                                    </strong>
                                ),
                                hr: () => <hr className="border-muted-foreground/20 my-4" />,
                            }}
                        >
                            {writing.content}
                        </ReactMarkdown>
                    </div>
                </PostcardFrame>
            </article>
        </main>
    )
}
