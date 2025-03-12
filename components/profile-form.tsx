"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X } from "lucide-react"
import MainLayout from "@/components/main-layout"

const musicGenres = [
  "Pop",
  "Rock",
  "Hip Hop",
  "R&B",
  "Country",
  "Electronic",
  "Jazz",
  "Classical",
  "Metal",
  "Folk",
  "Indie",
  "Punk",
  "Blues",
  "Reggae",
  "Soul",
  "Funk",
  "Disco",
  "Techno",
  "House",
]

type MusicPreference = {
  id: string
  userId: string
  type: "ARTIST" | "GENRE"
  name: string
  weight: number
}

type UserProfile = {
  id: string
  name: string
  email: string
  image: string | null
  profile: {
    id: string
    userId: string
    bio: string | null
    age: number | null
    gender: string | null
    location: string | null
    profileImage: string | null
  } | null
  musicPreferences: MusicPreference[]
}

export default function ProfileForm({
  userId,
  initialData,
}: {
  userId: string
  initialData: UserProfile | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Profile data
  const [name, setName] = useState(initialData?.name || "")
  const [age, setAge] = useState(initialData?.profile?.age ? initialData.profile.age.toString() : "")
  const [gender, setGender] = useState(initialData?.profile?.gender || "")
  const [location, setLocation] = useState(initialData?.profile?.location || "")
  const [bio, setBio] = useState(initialData?.profile?.bio || "")
  const [profileImage, setProfileImage] = useState(initialData?.profile?.profileImage || initialData?.image || "")

  // Music preferences
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>(
    initialData?.musicPreferences.filter((pref) => pref.type === "ARTIST").map((pref) => pref.name) || [],
  )
  const [newArtist, setNewArtist] = useState("")
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(
    initialData?.musicPreferences.filter((pref) => pref.type === "GENRE").map((pref) => pref.name) || [],
  )

  const handleAddArtist = () => {
    if (newArtist.trim() && !favoriteArtists.includes(newArtist.trim())) {
      setFavoriteArtists([...favoriteArtists, newArtist.trim()])
      setNewArtist("")
    }
  }

  const handleRemoveArtist = (artist: string) => {
    setFavoriteArtists(favoriteArtists.filter((a) => a !== artist))
  }

  const handleToggleGenre = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre))
    } else {
      setFavoriteGenres([...favoriteGenres, genre])
    }
  }

  const handleSubmit = async () => {
    if (favoriteArtists.length === 0 || favoriteGenres.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add at least one favorite artist and genre",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Save profile data
      const profileResponse = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age: Number.parseInt(age),
          gender,
          location,
          bio,
          profileImage,
        }),
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to save profile")
      }

      // Save music preferences
      const musicPrefsData = {
        preferences: [
          ...favoriteArtists.map((artist) => ({
            type: "ARTIST",
            name: artist,
            weight: 1,
          })),
          ...favoriteGenres.map((genre) => ({
            type: "GENRE",
            name: genre,
            weight: 1,
          })),
        ],
      }

      const musicResponse = await fetch("/api/music-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(musicPrefsData),
      })

      if (!musicResponse.ok) {
        throw new Error("Failed to save music preferences")
      }

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save your profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <MainLayout>
      <Card className="neomorphic max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="music">Music Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={item} className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                    <AvatarFallback>{name.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                    min="18"
                    max="120"
                    required
                  />
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                  />
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <Input
                    id="profileImage"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/your-image.jpg"
                  />
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="music">
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={item} className="space-y-2">
                  <Label>Favorite Artists</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newArtist}
                      onChange={(e) => setNewArtist(e.target.value)}
                      placeholder="Add an artist"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddArtist()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddArtist}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {favoriteArtists.map((artist) => (
                      <div key={artist} className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
                        <span className="mr-1">{artist}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArtist(artist)}
                          className="text-primary hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {favoriteArtists.length === 0 && (
                      <p className="text-sm text-muted-foreground">Add your favorite artists to find better matches</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <Label>Favorite Genres</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {musicGenres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleToggleGenre(genre)}
                        className={`px-3 py-2 rounded-md text-sm transition-colors ${
                          favoriteGenres.includes(genre)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>

            <motion.div variants={item} initial="hidden" animate="show" className="pt-6">
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={
                  loading || !name || !age || !gender || favoriteArtists.length === 0 || favoriteGenres.length === 0
                }
              >
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </motion.div>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  )
}

