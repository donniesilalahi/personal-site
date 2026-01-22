import { Linkedin, Mail, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProfileSection() {
  return (
    <section className="flex flex-col items-center gap-6 py-12 px-4">
      {/* Profile Info */}
      <div className="flex flex-col items-center gap-4">
        {/* Profile Picture */}
        <img
          src="/images/profile_picture.webp"
          alt="Donnie Silalahi"
          className="size-24 rounded-full object-cover ring-2 ring-border"
        />

        {/* Name */}
        <h1 className="text-2xl font-semibold tracking-tight">
          Donnie Silalahi
        </h1>

        {/* Professional Role */}
        <p className="text-center text-muted-foreground max-w-xs">
          Product Builder, Growth Marketer and Operations Leader
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Secondary CTA - Send Email */}
        <Button
          variant="secondary"
          render={<a href="mailto:donniesilalahi@gmail.com" />}
        >
          <Mail data-icon="inline-start" className="size-4" />
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
          <Linkedin data-icon="inline-start" className="size-4" />
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
          <Twitter data-icon="inline-start" className="size-4" />
          Say hi
        </Button>
      </div>
    </section>
  )
}
