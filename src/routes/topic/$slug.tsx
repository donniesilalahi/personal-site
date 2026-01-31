import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { WritingList } from '@/components/writing'
import { getTopicBySlug, getWritingsByTopic } from '@/lib/writings'

export const Route = createFileRoute('/topic/$slug')({
    component: TopicPage,
    loader: ({ params }) => {
        const topic = getTopicBySlug(params.slug)
        if (!topic) {
            throw notFound()
        }
        const writings = getWritingsByTopic(params.slug)
        return { topic, writings }
    },
    head: ({ loaderData }) => {
        if (!loaderData?.topic) {
            return { meta: [{ title: 'Topic | Donnie Silalahi' }] }
        }
        const { topic } = loaderData
        return {
            meta: [
                { title: `${topic.name} | Donnie Silalahi` },
                { name: 'description', content: topic.description },
            ],
        }
    },
})

function TopicPage() {
    const { topic, writings } = Route.useLoaderData()

    return (
        <main className="min-h-screen bg-white flex items-center justify-center py-16 mt-[120px]">
            <div className="w-full max-w-[720px] px-4 flex flex-col gap-8">
                {/* Header */}
                 <div className="flex flex-col gap-4">
                     <Link
                         to="/writings"
                         className="w-fit -ml-2 px-2 py-1 text-sm hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                     >
                         <ArrowLeft className="size-4" />
                         <span>Back</span>
                     </Link>
                    <div>
                         <h1 className="text-2xl font-medium text-foreground font-bricolage">
                             {topic.name}
                         </h1>
                        <p className="text-muted-foreground mt-1">{topic.description}</p>
                    </div>
                </div>

                {/* Writings in this topic */}
                <WritingList
                    writings={writings}
                    from="writings"
                    emptyMessage="No writings in this topic yet."
                />
            </div>
        </main>
    )
}
