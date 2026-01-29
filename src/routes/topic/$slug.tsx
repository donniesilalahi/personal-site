import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { WritingCard } from '@/components/writing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    <main className="min-h-screen bg-primitives-colors-gray-light-mode-50 flex items-center justify-center py-16">
      <div className="w-full max-w-[720px] px-4 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
            <Link to="/writings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All writings
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-medium text-foreground">
              {topic.name}
            </h1>
            <p className="text-muted-foreground mt-1">{topic.description}</p>
          </div>
        </div>

        {/* Writings in this topic */}
        <Card className="border-none shadow-none bg-white rounded-lg">
          <CardContent className="p-4">
            {writings.length > 0 ? (
              writings.map((writing) => (
                <WritingCard key={writing.id} writing={writing} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No writings in this topic yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
