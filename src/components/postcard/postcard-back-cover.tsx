import { useEffect, useState } from 'react'
import { NoiseOverlay, TextureOverlay } from './postcard-frame'
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

      // Format date as "Jan 22th, 2026"
      const date = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Jakarta',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

      // Format time as "20:43:01"
      const time = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
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
        'relative aspect-6/4 w-full max-w-[688px] cursor-pointer overflow-hidden rounded-sm border border-border bg-background',
        className,
      )}
      onClick={onClick}
      style={{
        boxShadow: '0px 3.17px 0px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Inner content container with 16px padding and 12px gap */}
      <div className="relative flex h-full w-full gap-3 p-4">
        {/* Left column - Message area */}
        <div className="flex min-w-0 flex-1 flex-col">
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
          <p className="mt-3 self-end font-playwrite-is text-base font-bold leading-6 text-foreground">
            Donnie
          </p>
        </div>

        {/* Vertical divider */}
        <Separator orientation="vertical" className="h-auto self-stretch" />

        {/* Right column - Sender information area (fixed width ~169px) */}
        <div className="flex w-[169px] shrink-0 flex-col gap-3">
          {/* Stamp */}
          <div className="flex justify-end">
            <div className="overflow-hidden rounded-[1px] border-2 border-border">
              <img
                src="/images/postcard_stamp.webp"
                alt="Stamp"
                className="h-[57px] w-[46px] object-cover"
              />
            </div>
          </div>

          {/* From section */}
          <div className="flex flex-1 flex-col gap-px">
            <div className="flex items-center">
              <span className="text-[10px] leading-4 text-foreground">
                From:
              </span>
            </div>
            <Separator className="bg-[#d9d9d9]" />

            {/* Location */}
            <div className="flex items-center pl-3.5">
              <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                Jakarta, Indonesia
              </span>
            </div>
            <Separator className="bg-[#d9d9d9]" />

            {/* Date */}
            <div className="flex items-center pl-3.5">
              <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                {date}
              </span>
            </div>
            <Separator className="bg-[#d9d9d9]" />

            {/* Time */}
            <div className="flex items-center pl-3.5">
              <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                {time}
              </span>
            </div>
            <Separator className="bg-[#d9d9d9]" />
          </div>

          {/* To section */}
          <div className="flex flex-col gap-px">
            <div className="flex items-center">
              <span className="text-[10px] leading-4 text-foreground">To:</span>
            </div>
            <Separator className="bg-[#d9d9d9]" />

            {/* Receiver location */}
            <div className="flex items-center pl-3.5">
              <span className="flex-1 text-xs leading-[18px] text-muted-foreground">
                {receiverLocation}
              </span>
            </div>
            <Separator className="bg-[#d9d9d9]" />
          </div>
        </div>
      </div>

      {/* Effect overlays */}
      <TextureOverlay />
      <NoiseOverlay />
    </div>
  )
}
