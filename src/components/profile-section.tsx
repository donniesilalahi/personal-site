import { useEffect, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Linkedin01Icon,
  NewTwitterRectangleIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { useProfileVisibility } from '@/hooks/use-profile-visibility'

export function ProfileSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { setProfileRef, setIsHomePage } = useProfileVisibility()

  useEffect(() => {
    setProfileRef(sectionRef)
    setIsHomePage(true)
    return () => setIsHomePage(false)
  }, [setProfileRef, setIsHomePage])

  return (
    <section ref={sectionRef} className="flex w-full flex-col gap-4 pt-24">
      {/* Name and Role - Vertical layout under header logo */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">
          Donnie Silalahi
        </h1>
        <p className="text-sm text-tertiary-foreground">
          Product Builder, Growth Marketer and Operations Leader
        </p>
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
