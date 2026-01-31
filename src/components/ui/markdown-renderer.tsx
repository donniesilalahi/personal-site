import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('text-sm leading-relaxed', className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl text-secondary-foreground font-normal mt-6 mb-3 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl text-secondary-foreground font-normal mt-6 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl text-secondary-foreground font-normal mt-6 mb-3 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg text-secondary-foreground font-normal mt-6 mb-3 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base text-secondary-foreground font-normal mt-6 mb-3 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm text-secondary-foreground font-normal mt-6 mb-3 first:mt-0">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-tertiary-foreground my-2">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 my-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-tertiary-foreground">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-tertiary-foreground/30 pl-4 italic text-tertiary-foreground my-3">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isCodeBlock = className?.includes('language-')
            return isCodeBlock ? (
              <code className="block bg-tertiary-foreground/10 text-tertiary-foreground p-4 rounded-lg overflow-x-auto text-xs my-3">
                {children}
              </code>
            ) : (
              <code className="bg-tertiary-foreground/10 text-tertiary-foreground px-1.5 py-0.5 rounded text-xs">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-tertiary-foreground/10 text-tertiary-foreground p-4 rounded-lg overflow-x-auto text-xs my-3">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-tertiary-foreground italic">{children}</em>
          ),
          del: ({ children }) => (
            <del className="text-muted-foreground line-through">{children}</del>
          ),
          hr: () => <hr className="border-tertiary-foreground/20 my-4" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg my-3"
              loading="lazy"
            />
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="even:bg-muted m-0 border-t p-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border px-4 py-2 text-left font-bold text-secondary-foreground [&[align=center]]:text-center [&[align=right]]:text-right">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border px-4 py-2 text-left text-tertiary-foreground [&[align=center]]:text-center [&[align=right]]:text-right">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
