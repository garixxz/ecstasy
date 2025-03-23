"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Music, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { ImageGallery } from "@/components/image-gallery"
import { Badge } from "@/components/ui/badge"

interface Profile {
  id: string
  name: string
  age: number
  location: string
  bio: string
  genres: string[]
  artists: string[]
  image: string
  images?: string[]
  compatibilityScore?: number
  isMatch?: boolean
  status?: "match" | "liked"
}

interface ProfileCardProps {
  profile: Profile
  onLike: () => void
  onDislike: () => void
}

export function ProfileCard({ profile, onLike, onDislike }: ProfileCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Combine main image with additional images, ensuring no duplicates
  const allImages = Array.from(new Set([profile.image, ...(profile.images || [])])).filter(Boolean)

  return (
    <Card className="overflow-hidden shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent className="p-0 relative">
        <div className="relative w-full">
          <ImageGallery images={allImages} aspectRatio="portrait" userName={profile.name} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">
                {profile.name}, {profile.age}
              </h3>
              {profile.compatibilityScore && (
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  {profile.compatibilityScore}% Match
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <MapPin className="h-3 w-3" />
              <span>{profile.location}</span>
            </div>
            <div className="mt-2">
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.genres.slice(0, 3).map((genre) => (
                  <span key={genre} className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {genre}
                  </span>
                ))}
                {profile.genres.length > 3 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">+{profile.genres.length - 3}</span>
                )}
              </div>
            </div>
          </div>
          <Button
            className="absolute top-4 right-4 text-white hover:text-white hover:bg-black/20 rounded-full"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Music className="h-5 w-5" />
          </Button>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-white dark:bg-gray-900 p-6 overflow-y-auto"
          >
            <Button className="absolute top-4 right-4 rounded-full" onClick={() => setShowDetails(false)}>
              <Music className="h-5 w-5" />
            </Button>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">
                  {profile.name}, {profile.age}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.location}</p>
              </div>

              <div>
                <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Favorite Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.genres.map((genre) => (
                    <span key={genre} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Top Artists</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.artists.map((artist) => (
                    <span key={artist} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="p-2">
        <div className="flex w-full justify-between">
          <Button className="rounded-full h-12 w-12 border-2 border-gray-300 dark:border-gray-700" onClick={onDislike}>
            <span className="sr-only">Dislike</span>
            <span className="text-xl">👎</span>
          </Button>
          <Button
            className="rounded-full h-12 w-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            onClick={onLike}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

