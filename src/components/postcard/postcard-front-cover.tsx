import { cn } from '@/lib/utils'

interface PostcardFrontCoverProps {
  className?: string
  onClick?: () => void
}

export function PostcardFrontCover({
  className,
  onClick,
}: PostcardFrontCoverProps) {
  return (
    <div
      className={cn(
        'relative aspect-[6/4] w-full cursor-pointer overflow-hidden rounded-lg bg-card shadow-lg',
        className,
      )}
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src="/images/postcard_frontcover.webp"
        alt="Silalahi, Toba Lakeside"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Quote */}
        <p className="font-serif text-2xl font-medium tracking-wide text-white md:text-3xl">
          ARE YOU LIVING YOUR DREAMS
        </p>

        {/* Caption */}
        <p className="mt-2 text-sm text-white/70">
          Silalahi, Toba Lakeside. 2021
        </p>
      </div>
    </div>
  )
}
