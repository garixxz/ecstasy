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
import { Plus, X } from "lucide-react"

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

export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Profile data
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState("")

  // Music preferences
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>([])
  const [newArtist, setNewArtist] = useState("")
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([])

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
    if (step === 1) {
      setStep(2)
      return
    }

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
        title: "Profile complete!",
        description: "Your profile has been set up successfully",
      })

      router.push("/dashboard")
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
    <Card className="neomorphic">
      <CardContent className="p-6">
        {step === 1 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.h2 variants={item} className="text-2xl font-bold">
              Tell us about yourself
            </motion.h2>

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
              {profileImage && (
                <div className="mt-2 flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage} alt="Profile preview" />
                    <AvatarFallback>{name.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </motion.div>

            <motion.div variants={item} className="pt-4">
              <Button onClick={handleSubmit} className="w-full" disabled={!name || !age || !gender}>
                Next: Music Preferences
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.h2 variants={item} className="text-2xl font-bold">
              Your Music Taste
            </motion.h2>

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

            <motion.div variants={item} className="pt-4 space-y-4">
              <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={loading || favoriteArtists.length === 0 || favoriteGenres.length === 0}
              >
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

