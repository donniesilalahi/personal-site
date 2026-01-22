import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PostcardBackCoverProps {
  className?: string
  onClick?: () => void
  receiverLocation?: string
}

function useJakartaTime(): string {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date()
      const jakartaTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      setTime(jakartaTime)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}

const postcardContent = `Hi, I'm Donnie.
I study patterns, run experiments, and scale what works.
Right now, I'm an aspiring product designer exploring how to make technology feel more human.
I work as a Swiss army knife at a fintech startup's CEO office — a role that shapeshifts every six months to whatever the business needs most. Over six years, I've built growth engines as a marketer, shipped foundational products as a PM, scaled operations 10x, and led new business lines.
At night, I break things for fun, sketch ideas, and learn how design and engineering dance together.
I believe good design isn't about trends — it's about honesty. It's what happens when craft meets empathy.
This small corner of the internet is where I'm documenting what I'm learning — experiments, half-formed thoughts, and the curiosities that keep me up at night.
I don't know exactly where it's heading, but I hope it leads to work that feels true.
p.s. I've used the em dash long before the AI era — it's leaner, simpler, cooler.
Are you living your dreams?`

export function PostcardBackCover({
  className,
  onClick,
  receiverLocation = 'Somewhere on Earth',
}: PostcardBackCoverProps) {
  const jakartaTime = useJakartaTime()

  return (
    <div
      className={cn(
        'relative aspect-[6/4] w-full cursor-pointer overflow-hidden rounded-lg bg-amber-50 shadow-lg',
        className,
      )}
      onClick={onClick}
    >
      {/* Postcard texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30" />

      {/* Main container with grid layout */}
      <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4 md:p-6">
        {/* Left side - Content area */}
        <div className="flex flex-col justify-between border-r border-amber-200/50 pr-4">
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <p className="text-[8px] leading-relaxed text-amber-900/80 md:text-[10px] lg:text-xs">
              {postcardContent.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < postcardContent.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* Signature */}
          <div className="mt-2 pt-2 border-t border-amber-200/30">
            <p className="font-serif text-sm italic text-amber-800 md:text-base">
              Donnie
            </p>
          </div>
        </div>

        {/* Right side - Sender area */}
        <div className="flex flex-col justify-between pl-2">
          {/* Stamp */}
          <div className="flex justify-end">
            <div className="relative">
              <img
                src="/images/postcard_stamp.webp"
                alt="Stamp"
                className="h-16 w-auto rotate-2 border-2 border-amber-200 object-contain md:h-20"
              />
              {/* Postmark overlay */}
              <div className="absolute -right-2 -top-2 size-12 rounded-full border-2 border-amber-700/30 md:size-14" />
            </div>
          </div>

          {/* Sender & Receiver Info */}
          <div className="mt-auto space-y-4">
            {/* Sender info */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 md:text-xs">
                From
              </p>
              <p className="text-xs text-amber-900 md:text-sm">
                Jakarta, Indonesia
              </p>
              <p className="font-mono text-xs text-amber-700 md:text-sm">
                {jakartaTime} GMT+7
              </p>
            </div>

            {/* Divider line for address */}
            <div className="space-y-2">
              <div className="h-px bg-amber-300/50" />
              <div className="h-px bg-amber-300/50" />
            </div>

            {/* Receiver info */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 md:text-xs">
                To
              </p>
              <p className="text-xs text-amber-900 md:text-sm">
                {receiverLocation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
