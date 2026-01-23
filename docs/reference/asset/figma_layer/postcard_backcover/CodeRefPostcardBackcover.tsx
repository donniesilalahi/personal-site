import { Separator } from '@/components/ui/separator'

const contentParagraphs = [
  "Hi, I'm Donnie.",
  'I study patterns, run experiments, and scale what works.',
  "Right now, I'm an aspiring product designer exploring how to make technology feel more human.",
  "I work as a Swiss army knife at a fintech startup's CEO office — a role that shapeshifts every six months to whatever the business needs most. Over six years, I've built growth engines as a marketer, shipped foundational products as a PM, scaled operations 10x, and led new business lines.",
  'At night, I break things for fun, sketch ideas, and learn how design and engineering dance together.',
  "I believe good design isn't about trends — it's about honesty. It's what happens when craft meets empathy.",
  "This small corner of the internet is where I'm documenting what I'm learning — experiments, half-formed thoughts, and the curiosities that keep me up at night.",
  "I don't know exactly where it's heading, but I hope it leads to work that feels true.",
  "p.s. I've used the em dash long before the AI era — it's leaner, simpler, cooler.",
  'Are you living your dreams?',
]

const fromDetails = [
  { label: 'Jakarta, Indonesia' },
  { label: 'Jan 22th, 2026' },
  { label: '20:43:01' },
]

const FigmarefPostcard = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-end gap-3 p-4 bg-primitives-colors-base-white-duplicate border border-1-color-modes-colors-border-border-secondary">
      <div className="flex flex-col flex-1 items-end gap-0">
        <div className="flex flex-col items-end justify-end gap-[13.45px] flex-1 w-full">
          <div className="flex flex-col items-start gap-1.5">
            {contentParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-text-xs-regular text-1-color-modes-colors-text-text-secondary-700 text-[length:var(--text-xs-regular-font-size)] leading-[var(--text-xs-regular-line-height)] font-[number:var(--text-xs-regular-font-weight)] tracking-[var(--text-xs-regular-letter-spacing)] [font-style:var(--text-xs-regular-font-style)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="[font-family:'Figma_Hand-Regular',Helvetica] text-black text-base leading-6 whitespace-nowrap font-normal tracking-[0]">
            Donnie
          </div>
        </div>
      </div>

      <Separator
        orientation="vertical"
        className="w-px border-[0.84px] border-1-color-modes-colors-border-border-secondary self-stretch"
      />

      <div className="flex flex-col w-[169.02px] items-end gap-[13.45px] self-stretch">
        <div className="flex flex-col items-end gap-[13.45px] flex-1 w-full">
          <div className="inline-flex items-center">
            <div className="flex w-[45.87px] items-center gap-[9.17px] rounded-[1.15px] overflow-hidden border-[2.29px] border-solid border-1-color-modes-colors-border-border-secondary">
              <div className="w-[45.87px] h-[57.33px] bg-[url(/front-cover.png)] bg-[100%_100%]" />
            </div>
          </div>

          <div className="flex flex-col items-start gap-[1.68px] flex-1 w-full">
            <div className="flex items-center gap-[6.73px] w-full">
              <span className="font-text-2xs-regular text-black text-[length:var(--text-2xs-regular-font-size)] leading-[var(--text-2xs-regular-line-height)] whitespace-nowrap font-[number:var(--text-2xs-regular-font-weight)] tracking-[var(--text-2xs-regular-letter-spacing)] [font-style:var(--text-2xs-regular-font-style)]">
                From:
              </span>
            </div>

            <Separator className="w-full h-px bg-[#d9d9d9]" />

            {fromDetails.map((detail, index) => (
              <div key={index}>
                <div className="flex items-center gap-[6.73px] pl-[13.45px] w-full">
                  <span className="flex-1 font-text-xs-regular font-[number:var(--text-xs-regular-font-weight)] text-1-color-modes-colors-text-text-tertiary-600 text-[length:var(--text-xs-regular-font-size)] tracking-[var(--text-xs-regular-letter-spacing)] leading-[var(--text-xs-regular-line-height)] [font-style:var(--text-xs-regular-font-style)]">
                    {detail.label}
                  </span>
                </div>
                <Separator className="w-full h-px bg-[#d9d9d9]" />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-[1.68px] w-full">
            <div className="flex items-center gap-[6.73px] w-full">
              <span className="font-text-2xs-regular text-black text-[length:var(--text-2xs-regular-font-size)] leading-[var(--text-2xs-regular-line-height)] whitespace-nowrap font-[number:var(--text-2xs-regular-font-weight)] tracking-[var(--text-2xs-regular-letter-spacing)] [font-style:var(--text-2xs-regular-font-style)]">
                To:
              </span>
            </div>

            <Separator className="w-full h-px bg-[#d9d9d9]" />

            <div className="flex items-center gap-[6.73px] pl-[13.45px] w-full">
              <span className="flex-1 font-text-xs-regular font-[number:var(--text-xs-regular-font-weight)] text-1-color-modes-colors-text-text-tertiary-600 text-[length:var(--text-xs-regular-font-size)] tracking-[var(--text-xs-regular-letter-spacing)] leading-[var(--text-xs-regular-line-height)] [font-style:var(--text-xs-regular-font-style)]">
                City, Country
              </span>
            </div>

            <Separator className="w-full h-px bg-[#d9d9d9]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FigmarefPostcard
