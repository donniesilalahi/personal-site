import { useEffect, useState } from 'react'
import { NoiseOverlay, TextureOverlay } from './postcard-frame'
import { PostcardStamp } from './postcard-stamp'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface PostcardBackCoverProps {
  className?: string
  onClick?: () => void
  receiverLocation?: string
}

interface JakartaDateTime {
  date: string
  time: string
}

function useJakartaTime(): JakartaDateTime {
  const [dateTime, setDateTime] = useState<JakartaDateTime>({
    date: '',
    time: '',
  })

  useEffect(() => {
    const updateDateTime = (): void => {
      const now = new Date()

      // Format date as "25 Jan 2026"
      const date = now.toLocaleDateString('en-GB', {
        timeZone: 'Asia/Jakarta',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      // Format time as "08:43:01 PM"
      const time = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })

      setDateTime({ date, time })
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return dateTime
}

const postcardParagraphs = [
  "Hi, I'm Donnie.",
  'I study patterns, run experiments, and scale what works.',
  "I'm an aspiring product designer exploring how to make tech feel more human.",
  "By day, I am a Swiss army knife at a fintech startup's CEO office — shapeshifting every six months to what the business needs most. Over six years, I have built growth engines, shipped products, scaled ops 10x, launched and led new business lines.",
  'By night, I break, sketch, and learn how design and engineering dance.',
  "Good design isn't trends — it's honesty: craft meeting empathy. Here, I document experiments, half-formed thoughts, and curiosities that keep me up at night. I hope it leads to work that feels true.",
  'p.s. Em dashes were mine before AI — leaner, simpler, cooler.',
  'Are you living your dreams?',
]

export function PostcardBackCover({
  className,
  onClick,
  receiverLocation = 'City, Country',
}: PostcardBackCoverProps) {
  const { date, time } = useJakartaTime()

  return (
    <div
      className={cn(
        'relative w-full max-w-[688px] cursor-pointer overflow-hidden rounded-sm border border-border bg-background md:aspect-[6/4]',
        className,
      )}
      onClick={onClick}
      style={{
        boxShadow: '0px 3.17px 0px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Inner content container */}
      <div className="relative flex h-full w-full flex-wrap-reverse md:flex-nowrap md:gap-3 md:p-4">
        {/* Message area - full width on mobile, flex-1 on desktop */}
        <div className="flex w-full min-w-0 flex-col p-2 md:w-auto md:flex-1 md:p-0">
          {/* Content paragraphs - fills available space and aligns to top */}
          <div className="flex w-full flex-1 flex-col gap-1.5">
            {postcardParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm leading-[18px] text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Signature - stays at bottom */}
          <p className="mt-3 self-end font-italianno text-2xl leading-6 text-foreground">
            Donnie
          </p>
        </div>

        {/* Divider - horizontal full-width on mobile, vertical on desktop */}
        <Separator
          orientation="vertical"
          className="hidden h-auto self-stretch md:block"
        />
        <Separator
          orientation="horizontal"
          className="my-4 w-full bg-border md:hidden"
        />

        {/* Sender information area - full width on mobile, fixed width on desktop */}
        {/* Mobile: two sub-columns (sender-receiver left, stamp right) */}
        {/* Desktop: single column with stamp on top */}
        <div className="flex w-full shrink-0 gap-3 p-2 md:w-[169px] md:flex-col md:p-0">
          {/* Left sub-column on mobile: sender-receiver info with 32px padding-top */}
          {/* On desktop: this comes after stamp, so reorder with order classes */}
          <div className="flex flex-1 flex-col gap-3 pt-8 md:order-2 md:pt-0">
            {/* From section */}
            <div className="flex flex-1 flex-col gap-px">
              <div className="flex items-center">
                <span className="text-[10px] leading-4 text-foreground">
                  From:
                </span>
              </div>
              <Separator className="bg-border/50" />

              {/* Location */}
              <div className="flex items-center pl-3.5">
                <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                  Jakarta, Indonesia
                </span>
              </div>
              <Separator className="bg-border/50" />

              {/* Date and Time - same line on mobile, separate on desktop */}
              <div className="flex items-center pl-3.5 md:hidden">
                <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                  {date}, {time}
                </span>
              </div>
              <div className="hidden md:flex md:items-center md:pl-3.5">
                <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                  {date}
                </span>
              </div>
              <Separator className="bg-border/50" />

              {/* Time - desktop only (separate line) */}
              <div className="hidden md:flex md:items-center md:pl-3.5">
                <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                  {time} <sup>GMT+7</sup>
                </span>
              </div>
              <Separator className="hidden bg-border/50 md:block" />
            </div>

            {/* To section */}
            <div className="flex flex-col gap-px">
              <div className="flex items-center">
                <span className="text-[10px] leading-4 text-foreground">
                  To:
                </span>
              </div>
              <Separator className="bg-border/50" />

              {/* Receiver location */}
              <div className="flex items-center pl-3.5">
                <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                  {receiverLocation}
                </span>
              </div>
              <Separator className="bg-border/50" />
            </div>
          </div>

          {/* Right sub-column on mobile: stamp */}
          {/* On desktop: stamp comes first (top) */}
          <div className="flex items-start justify-end md:order-1">
            <PostcardStamp
              src="/images/postcard_stamp.webp"
              alt="Postage stamp"
              className="w-[48px]"
            />
          </div>
        </div>
      </div>

      {/* Effect overlays */}
      <TextureOverlay />
      <NoiseOverlay />
    </div>
  )
}
