import { HugeiconsIcon } from '@hugeicons/react'
import {
  Linkedin01Icon,
  NewTwitterRectangleIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ProfileSection() {
  return (
    <section className="flex w-full flex-col gap-4">
      {/* Profile Info - Horizontal layout */}
      <div className="flex items-center gap-4">
        {/* Profile Picture with postcard frame effect */}
        <div
          className={cn(
            'group relative size-[60px] shrink-0 overflow-hidden rounded-sm border border-border',
          )}
        >
          {/* Content container with 4px white mat padding and 52px inner frame */}
          <div className="relative h-full w-full overflow-hidden rounded-[2px] p-1 bg-card">
            <img
              src="/images/profile_picture.webp"
              alt="Donnie Silalahi"
              className="h-full w-full scale-[1.6] rounded-[2px] object-cover object-[50%_30%] transition-transform duration-300 group-hover:scale-[2]"
            />

            {/* Texture overlay - paper-like effect */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='texture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23texture)'/%3E%3C/svg%3E")`,
                opacity: 0.04,
                mixBlendMode: 'overlay',
              }}
              aria-hidden="true"
            />

            {/* Noise overlay - grainy film effect */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                opacity: 0.1,
                mixBlendMode: 'soft-light',
                backgroundColor: 'rgba(246, 243, 241, 0.1)',
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Name and Role */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-primitives-colors-gray-light-mode-900">
            Donnie Silalahi
          </h1>
          <p className="text-sm text-primitives-colors-gray-light-mode-600">
            Product Builder, Growth Marketer and Operations Leader
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Primary CTA - Send Email */}
        <Button
          variant="default"
          render={<a href="mailto:donniesilalahi@gmail.com" />}
        >
          Send email
        </Button>

        {/* Tertiary Outline CTA - LinkedIn */}
        <Button
          variant="outline"
          render={
            <a
              href="https://linkedin.com/in/donniesilalahi"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <HugeiconsIcon icon={Linkedin01Icon} size={16} />
          Connect
        </Button>

        {/* Tertiary Outline CTA - Twitter */}
        <Button
          variant="outline"
          render={
            <a
              href="https://x.com/donniesilalahi"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <HugeiconsIcon icon={NewTwitterRectangleIcon} size={16} />
          Say hi
        </Button>
      </div>
    </section>
  )
}
