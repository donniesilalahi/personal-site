import { PostcardFrame } from './postcard-frame'
import { ImageEffects } from './image-effects'
import type { ImageEffectPreset } from './image-effects'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PostcardFrontCoverProps {
  className?: string
  onClick?: () => void
  /** Image effect preset: 'none' | 'misty' | 'vintage' */
  imageEffect?: ImageEffectPreset
}

export function PostcardFrontCover({
  className,
  onClick,
  imageEffect = 'vintage',
}: PostcardFrontCoverProps) {
  return (
    <PostcardFrame className={className} onClick={onClick}>
      {/* Background Image with effect */}
      <ImageEffects preset={imageEffect}>
        <img
          src="/images/postcard_frontcover.webp"
          alt="Scenic landscape of Silalahi, Toba Lakeside showing a winding road through green hills with mountains in the background"
          className="h-full w-full object-cover"
        />
      </ImageEffects>

      {/* Quote Overlay - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className={cn(
            'px-4 text-center font-normal leading-tight text-white',
            'text-[48px] md:text-5xl lg:text-6xl',
          )}
          style={{
            fontFamily: 'Marcellus, serif',
            textShadow: '3.36px 3.36px 42.04px rgba(0, 0, 0, 0.5)',
            WebkitTextStroke: '0.42px white',
          }}
        >
          ARE YOU LIVING
          <br />
          YOUR DREAMS?
        </h1>
      </div>

      {/* Caption - Bottom */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <Button
          variant="ghost"
          size="xs"
          render={
            <a
              href="https://maps.app.goo.gl/VpRz82Fa7vdqSgnz9"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          className="text-white hover:text-white hover:bg-white/10"
        >
          Silalahi, Toba Lakeside. 2021
        </Button>
      </div>
    </PostcardFrame>
  )
}
