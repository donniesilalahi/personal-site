import frontCover from './front-cover.png'
import { Card, CardContent } from '@/components/ui/card'

const FigmarefPostcard = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center p-[18.35px] bg-primitives-colors-gray-warm-25-duplicate">
      <Card className="border border-solid border-1-color-modes-colors-border-border-secondary overflow-hidden max-w-4xl w-full">
        <CardContent className="p-0 relative">
          <img
            className="w-full h-auto object-cover aspect-[1.5]"
            alt="Scenic landscape of Silalahi, Toba Lakeside showing a winding road through green hills with mountains in the background"
            src={frontCover}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="[text-shadow:3.36px_3.36px_42.04px_#00000080] [-webkit-text-stroke:0.42px_#ffffff] [font-family:'Marcellus-Regular',Helvetica] text-4xl md:text-5xl lg:text-6xl leading-tight font-normal text-white text-center tracking-[0] px-4">
              ARE YOU LIVING
              <br />
              YOUR DREAMS?
            </h1>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <p className="font-text-xs-regular text-[length:var(--text-xs-regular-font-size)] leading-[var(--text-xs-regular-line-height)] font-[number:var(--text-xs-regular-font-weight)] text-white text-center tracking-[var(--text-xs-regular-letter-spacing)] [font-style:var(--text-xs-regular-font-style)]">
              Silalahi, Toba Lakeside. 2021
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FigmarefPostcard
