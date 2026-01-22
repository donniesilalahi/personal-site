import { createFileRoute } from '@tanstack/react-router'
import { ProfileSection } from '@/components/profile-section'
import { Postcard } from '@/components/postcard'
import { formatLocation, useGeolocation } from '@/lib/use-geolocation'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { city, country, isLoading } = useGeolocation()
  const receiverLocation = isLoading
    ? 'Detecting your location...'
    : formatLocation(city, country)

  return (
    <main className="min-h-screen">
      <ProfileSection />
      <Postcard receiverLocation={receiverLocation} />
    </main>
  )
}
