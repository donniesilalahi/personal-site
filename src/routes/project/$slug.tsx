import { Link, createFileRoute, notFound, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { DottedLinesOverlay, PostcardFrame } from '@/components/postcard/postcard-frame'
import { Button } from '@/components/ui/button'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { getProjectBySlug } from '@/lib/projects'

type SearchParams = {
  from?: 'home' | 'projects'
}

export const Route = createFileRoute('/project/$slug')({
  component: ProjectPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      from:
        search.from === 'home' || search.from === 'projects'
          ? search.from
          : undefined,
    }
  },
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug)
    if (!project) {
      throw notFound()
    }
    return { project }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.project) {
      return { meta: [{ title: 'Project | Donnie Silalahi' }] }
    }
    const { project } = loaderData
    const siteUrl = 'https://donniesilalahi.com'
    return {
      meta: [
        { title: project.seoTitle || `${project.title} | Donnie Silalahi` },
        {
          name: 'description',
          content: project.seoDescription || project.description,
        },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${siteUrl}/project/${project.slug}` },
        {
          property: 'og:title',
          content: project.seoTitle || project.title,
        },
        {
          property: 'og:description',
          content: project.seoDescription || project.description,
        },
        {
          property: 'og:image',
          content: project.seoImage || `${siteUrl}/opengraph.webp`,
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: `${siteUrl}/project/${project.slug}` },
        {
          name: 'twitter:title',
          content: project.seoTitle || project.title,
        },
        {
          name: 'twitter:description',
          content: project.seoDescription || project.description,
        },
        {
          name: 'twitter:image',
          content: project.seoImage || `${siteUrl}/opengraph.webp`,
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

function ProjectPage() {
  const { project } = Route.useLoaderData()
  const { from } = useSearch({ from: '/project/$slug' })

  const backLink = '/'

  const rolesText = project.roles.map((role) => role.toUpperCase()).join(' + ')
  const tagsText = project.tags.map((tag) => `#${tag.toLowerCase()}`).join(' ')

  return (
    <main className="min-h-screen bg-secondary flex items-center justify-center py-16 mt-[120px] font-inter">
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
            <h1 className="text-3xl font-black text-secondary-foreground font-bricolage">
              {project.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <time dateTime={project.publishedAt}>
                {formatFullDate(project.publishedAtParsed)}
              </time>
              <span>·</span>
              <span className="font-medium tracking-wide">{rolesText}</span>
              {project.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground/50">//</span>
                  <span>{tagsText}</span>
                </>
              )}
            </div>

            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <PostcardFrame className="md:aspect-auto dark:bg-card">
          <div className="relative w-full overflow-hidden rounded-[2px]">
            <MarkdownRenderer
              content={project.content}
              className="prose prose-neutral max-w-none"
            />
            {/* Dotted lines overlay */}
            <DottedLinesOverlay />
          </div>
        </PostcardFrame>
      </article>
    </main>
  )
}
