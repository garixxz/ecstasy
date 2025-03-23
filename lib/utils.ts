import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to calculate music compatibility score between two users
export function calculateMusicCompatibility(
  userGenres: string[],
  userArtists: string[],
  otherGenres: string[],
  otherArtists: string[],
): number {
  // Calculate genre match percentage
  const genreMatches = userGenres.filter((genre) => otherGenres.includes(genre)).length
  const genreScore = userGenres.length > 0 ? (genreMatches / userGenres.length) * 100 : 0

  // Calculate artist match percentage
  const artistMatches = userArtists.filter((artist) => otherArtists.includes(artist)).length
  const artistScore = userArtists.length > 0 ? (artistMatches / userArtists.length) * 100 : 0

  // Weighted average (artists slightly more important than genres)
  return Math.round(genreScore * 0.4 + artistScore * 0.6)
}

// Function to get recommended profiles based on music taste
export function getRecommendedProfiles(userProfile: any, allProfiles: any[]): any[] {
  const userGenres = userProfile.genres || []
  const userArtists = userProfile.artists || []

  // Calculate compatibility score for each profile
  const profilesWithScores = allProfiles
    .filter((profile) => profile.id !== userProfile.id)
    .map((profile) => {
      const compatibilityScore = calculateMusicCompatibility(
        userGenres,
        userArtists,
        profile.genres || [],
        profile.artists || [],
      )

      return {
        ...profile,
        compatibilityScore,
      }
    })

  // Sort by compatibility score (highest first)
  return profilesWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
}

export function getFallbackImageUrl(userName: string, height: number, width: number): string {
  return `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(userName)}`
}

