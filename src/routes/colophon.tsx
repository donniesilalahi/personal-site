import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/colophon')({
  component: ColophonPage,
})

function ColophonPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-24">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground font-bricolage mb-2">
            Colophon
          </h1>
          <p className="text-secondary-foreground">
            Details about the design, tools, and inspiration behind this website.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Design & Development</h2>
            <p>
              This website is built with <strong>TanStack Start</strong> and <strong>React 19</strong>,
              leveraging modern web technologies for performance and developer experience.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Styling</h2>
            <p>
              The design uses <strong>Tailwind CSS v4</strong> and <strong>Shadcn UI</strong> components
              for a clean, accessible interface.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Deployment</h2>
            <p>
              Hosted on <strong>Cloudflare Workers</strong> for edge computing and fast global delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Typography</h2>
            <p>
              The site uses system fonts for optimal performance and legibility across all devices.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
