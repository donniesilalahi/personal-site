import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import type { Topic } from '@/lib/writings'
import { WritingCard } from '@/components/writing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAllTopics, getAllWritings } from '@/lib/writings'

export const Route = createFileRoute('/writings')({
  component: WritingsPage,
  head: () => ({
    meta: [
      { title: 'Writing | Donnie Silalahi' },
      {
        name: 'description',
        content:
          'Thoughts, daily observation, and reflection on things I make',
      },
    ],
  }),
})

function WritingsPage() {
  const writings = getAllWritings()
  const topics = getAllTopics()

  return (
    <main className="min-h-screen bg-primitives-colors-gray-light-mode-50 flex items-center justify-center py-16">
      <div className="w-full max-w-[720px] px-4 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-medium text-foreground">Writing</h1>
            <p className="text-muted-foreground mt-1">
              Thoughts, daily observation, and reflection on things I make
            </p>
          </div>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topics.map((topic: Topic) => (
              <Button key={topic.id} variant="outline" size="sm" asChild>
                <Link to="/topic/$slug" params={{ slug: topic.slug }}>
                  {topic.name}
                </Link>
              </Button>
            ))}
          </div>
        )}

        {/* All writings */}
        <Card className="border-none shadow-none bg-white rounded-lg">
          <CardContent className="p-4">
            {writings.length > 0 ? (
              writings.map((writing) => (
                <WritingCard key={writing.id} writing={writing} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No writings yet. Check back soon!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
