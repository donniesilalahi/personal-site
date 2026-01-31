import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/page-layout'

export const Route = createFileRoute('/ai')({
  component: AIPage,
})

function AIPage() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground font-bricolage mb-2">
            AI
          </h1>
          <p className="text-secondary-foreground">
            My thoughts and explorations on artificial intelligence, machine learning, and the
            future of AI.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <p>
            This page is under development. Check back soon for insights on AI, machine learning,
            and how technology is shaping the future.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
