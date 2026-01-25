import { createFileRoute } from '@tanstack/react-router'
import { ProfileSection } from '@/components/profile-section'
import { PostcardSection } from '@/components/postcard/postcard-section'
import { CareerTimelineSection } from '@/components/career-timeline'
import { formatLocation, useGeolocation } from '@/lib/use-geolocation'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { city, country, isLoading } = useGeolocation()
  const receiverLocation = isLoading
    ? 'Detecting your location...'
    : formatLocation(city, country)

  return (
    <main className="min-h-screen bg-primitives-colors-gray-light-mode-50 flex items-center justify-center p-4 md:p-8">
      {/* Core content wrapper with max-width and mobile padding */}
      <div className="w-full max-w-[720px] px-4 md:px-0 flex flex-col gap-8">
        <ProfileSection />
        <PostcardSection receiverLocation={receiverLocation} />
        <CareerTimelineSection />
      </div>
    </main>
  )
}
