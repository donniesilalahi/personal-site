import { useEffect, useState } from 'react'

interface GeoLocation {
  city: string
  country: string
  isLoading: boolean
  error: string | null
}

/**
 * Hook to detect user's location using IP geolocation API
 * Uses ipapi.co free tier (no API key required, 1000 requests/day)
 */
export function useGeolocation(): GeoLocation {
  const [location, setLocation] = useState<GeoLocation>({
    city: '',
    country: '',
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchLocation = async (): Promise<void> => {
      try {
        // Using ipapi.co free tier
        const response = await fetch('https://ipapi.co/json/')
        if (!response.ok) {
          throw new Error('Failed to fetch location')
        }
        const data = await response.json()

        setLocation({
          city: data.city || 'Unknown City',
          country: data.country_name || 'Unknown Country',
          isLoading: false,
          error: null,
        })
      } catch (err) {
        setLocation({
          city: '',
          country: '',
          isLoading: false,
          error:
            err instanceof Error ? err.message : 'Failed to detect location',
        })
      }
    }

    fetchLocation()
  }, [])

  return location
}

/**
 * Format location string from city and country
 */
export function formatLocation(city: string, country: string): string {
  if (city && country) {
    return `${city}, ${country}`
  }
  if (country) {
    return country
  }
  return 'Somewhere on Earth'
}
