import { Linkedin } from './icons/custom-social/linkedin'
import { Twitter } from './icons/custom-social/twitter'
import { Button } from '@/components/ui/button'

export function ProfileSection() {
  return (
    <section className="flex w-full flex-col gap-4">
      {/* Profile Info - Horizontal layout */}
      <div className="flex items-center gap-4">
        {/* Profile Picture with bleed effect */}
        <div className="size-[60px] shrink-0 flex items-center justify-center bg-primitives-colors-gray-light-mode-300 rounded-[4px]">
          <img
            src="/images/profile_picture.webp"
            alt="Donnie Silalahi"
            className="size-[53.33px] rounded-[3.33px] object-cover object-[50%_30%]"
          />
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
        {/* Secondary CTA - Send Email */}
        <Button
          variant="secondary"
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
          <Linkedin className="size-4" />
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
          <Twitter className="size-4 scale-[0.9]" />
          Say hi
        </Button>
      </div>
    </section>
  )
}
