import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import type { Topic } from '@/lib/writings'
import { WritingList } from '@/components/writing'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAllTopics, getAllWritings, getWritingsByTopic } from '@/lib/writings'

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
        <main className="min-h-screen bg-secondary flex items-center justify-center py-16">
            <div className="w-full max-w-[720px] px-4 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
                        <Link to="/" className="flex items-center gap-2">
                            <ArrowLeft className="size-4" />
                            <span>Kembali</span>
                        </Link>
                    </Button>
                    <div>
                         <h1 className="text-2xl font-medium text-foreground font-bricolage">Writing</h1>
                        <p className="text-muted-foreground mt-1">
                            Thoughts, daily observation, and reflection on things I make
                        </p>
                    </div>
                </div>

                {/* Tabs for topics */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full justify-start h-auto flex-wrap gap-1 bg-transparent p-0">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-md"
                        >
                            All
                        </TabsTrigger>
                        {topics.map((topic: Topic) => (
                            <TabsTrigger
                                key={topic.id}
                                value={topic.slug}
                                className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-md"
                            >
                                {topic.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                        <WritingList writings={writings} from="writings" />
                    </TabsContent>

                    {topics.map((topic: Topic) => {
                        const topicWritings = getWritingsByTopic(topic.slug)
                        return (
                            <TabsContent key={topic.id} value={topic.slug} className="mt-6">
                                <WritingList
                                    writings={topicWritings}
                                    from="writings"
                                    emptyMessage="No writings in this topic yet."
                                />
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </div>
        </main>
    )
}
