import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <main className={cn('min-h-screen pt-[120px] pb-16', className)}>
      <div className="mx-auto max-w-[720px] px-4">{children}</div>
    </main>
  )
}
