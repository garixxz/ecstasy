type MusicPreference = {
  id: string
  userId: string
  type: "ARTIST" | "GENRE"
  name: string
  weight: number
}

export function calculateCompatibility(userPrefs: MusicPreference[], otherUserPrefs: MusicPreference[]): number {
  // Extract artists and genres from both users
  const userArtists = userPrefs.filter((pref) => pref.type === "ARTIST").map((pref) => pref.name.toLowerCase())

  const userGenres = userPrefs.filter((pref) => pref.type === "GENRE").map((pref) => pref.name.toLowerCase())

  const otherUserArtists = otherUserPrefs
    .filter((pref) => pref.type === "ARTIST")
    .map((pref) => pref.name.toLowerCase())

  const otherUserGenres = otherUserPrefs.filter((pref) => pref.type === "GENRE").map((pref) => pref.name.toLowerCase())

  // Find common artists and genres
  const commonArtists = userArtists.filter((artist) => otherUserArtists.includes(artist))

  const commonGenres = userGenres.filter((genre) => otherUserGenres.includes(genre))

  // Calculate artist similarity (weighted more heavily)
  const artistSimilarity =
    commonArtists.length > 0 ? commonArtists.length / Math.max(userArtists.length, otherUserArtists.length) : 0

  // Calculate genre similarity
  const genreSimilarity =
    commonGenres.length > 0 ? commonGenres.length / Math.max(userGenres.length, otherUserGenres.length) : 0

  // Weight artist matches more heavily than genre matches
  const weightedScore = artistSimilarity * 0.7 + genreSimilarity * 0.3

  // Apply a bonus for having at least one exact artist match
  const exactMatchBonus = commonArtists.length > 0 ? 0.1 : 0

  // Calculate final score (capped at 1.0)
  return Math.min(weightedScore + exactMatchBonus, 1.0)
}

