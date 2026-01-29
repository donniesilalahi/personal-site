import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'
import { COLUMN_GAP_PX } from './career-calendar.constants'
import type { Experience } from '@/lib/experiences'
import type {
  ProcessedCard,
  ProcessedColumn,
  ProcessedGroup,
} from './career-calendar.types'
import { cn } from '@/lib/utils'

interface GroupRendererProps {
  group: ProcessedGroup
  onExperienceClick?: (experience: Experience) => void
}

export function GroupRenderer({
  group,
  onExperienceClick,
}: GroupRendererProps) {
  const { topPx, heightPx, columns } = group

  if (columns.length === 1) {
    return (
      <>
        {columns[0].cards.map((card) => (
          <SingleCard
            key={card.experience.id}
            card={card}
            isFullWidth={columns[0].isRegular}
            onClick={
              onExperienceClick
                ? () => onExperienceClick(card.experience)
                : undefined
            }
          />
        ))}
      </>
    )
  }

  const gridCols = columns
    .map((col) => (col.isRegular ? '1fr' : 'auto'))
    .join(' ')

  return (
    <div
      className="absolute left-0 right-0 grid"
      style={{
        top: topPx,
        height: heightPx,
        gridTemplateColumns: gridCols,
        gap: COLUMN_GAP_PX,
      }}
    >
      {columns.map((column) => (
        <GridColumn
          key={column.index}
          column={column}
          groupTopPx={topPx}
          onExperienceClick={onExperienceClick}
        />
      ))}
    </div>
  )
}

interface GridColumnProps {
  column: ProcessedColumn
  groupTopPx: number
  onExperienceClick?: (experience: Experience) => void
}

function GridColumn({
  column,
  groupTopPx,
  onExperienceClick,
}: GridColumnProps) {
  const { isRegular, cards } = column

  if (isRegular) {
    return (
      <div className="relative min-w-0">
        {cards.map((card) => (
          <CardWrapper
            key={card.experience.id}
            card={card}
            relativeTop={card.topPx - groupTopPx}
            isFullWidth
            onClick={
              onExperienceClick
                ? () => onExperienceClick(card.experience)
                : undefined
            }
          />
        ))}
      </div>
    )
  }

  const sizerCard = cards[0]

  return (
    <div className="relative">
      <div className="h-0 overflow-visible" aria-hidden="true">
        <div className="opacity-0 pointer-events-none">
          {sizerCard.cardType === 'milestone' ? (
            <MilestoneEntry experience={sizerCard.experience} />
          ) : (
            <ExperienceEntryCard
              experience={sizerCard.experience}
              isVeryShortDuration={sizerCard.experience.durationMonths <= 6}
            />
          )}
        </div>
      </div>
      {cards.map((card) => (
        <CardWrapper
          key={card.experience.id}
          card={card}
          relativeTop={card.topPx - groupTopPx}
          isFullWidth={false}
          onClick={
            onExperienceClick
              ? () => onExperienceClick(card.experience)
              : undefined
          }
        />
      ))}
    </div>
  )
}

interface CardWrapperProps {
  card: ProcessedCard
  relativeTop: number
  isFullWidth: boolean
  onClick?: () => void
}

function CardWrapper({
  card,
  relativeTop,
  isFullWidth,
  onClick,
}: CardWrapperProps) {
  const { experience, heightPx, cardType } = card
  const isVeryShortDuration = experience.durationMonths <= 6

  if (cardType === 'milestone') {
    return (
      <div
        className="absolute left-0"
        style={{ top: relativeTop }}
        onClick={onClick}
      >
        <MilestoneEntry experience={experience} />
      </div>
    )
  }

  return (
    <div
      className={cn('absolute left-0', isFullWidth && 'right-0')}
      style={{ top: relativeTop, height: heightPx }}
      onClick={onClick}
    >
      <ExperienceEntryCard
        experience={experience}
        isVeryShortDuration={isVeryShortDuration}
        className={cn('h-full', isFullWidth && 'w-full')}
      />
    </div>
  )
}

interface SingleCardProps {
  card: ProcessedCard
  isFullWidth: boolean
  onClick?: () => void
}

function SingleCard({ card, isFullWidth, onClick }: SingleCardProps) {
  const { experience, topPx, heightPx, cardType } = card
  const isVeryShortDuration = experience.durationMonths <= 6

  if (cardType === 'milestone') {
    return (
      <div
        className="absolute"
        style={{ top: topPx, left: 0 }}
        onClick={onClick}
      >
        <MilestoneEntry experience={experience} />
      </div>
    )
  }

  return (
    <div
      className="absolute"
      style={{
        top: topPx,
        height: heightPx,
        left: 0,
        right: isFullWidth ? 0 : undefined,
      }}
      onClick={onClick}
    >
      <ExperienceEntryCard
        experience={experience}
        isVeryShortDuration={isVeryShortDuration}
        className={cn('h-full', isFullWidth && 'w-full')}
      />
    </div>
  )
}
