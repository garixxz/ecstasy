"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { MusicIcon, ArrowRight, Check, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bio, setBio] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Electronic",
    "Jazz",
    "Classical",
    "Country",
    "Folk",
    "Metal",
    "Indie",
    "Alternative",
    "Reggae",
    "Blues",
    "Soul",
    "Funk",
    "Disco",
    "Punk",
    "Techno",
    "House",
  ]

  const artists = [
    "Taylor Swift",
    "The Weeknd",
    "Bad Bunny",
    "Drake",
    "Billie Eilish",
    "BTS",
    "Dua Lipa",
    "Ed Sheeran",
    "Harry Styles",
    "Beyoncé",
    "Kendrick Lamar",
    "Adele",
    "Post Malone",
    "Ariana Grande",
    "Travis Scott",
    "Olivia Rodrigo",
    "Justin Bieber",
    "Doja Cat",
    "SZA",
    "Lil Nas X",
  ]

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const toggleArtist = (artist: string) => {
    if (selectedArtists.includes(artist)) {
      setSelectedArtists(selectedArtists.filter((a) => a !== artist))
    } else {
      setSelectedArtists([...selectedArtists, artist])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // For this example, we'll use the data URL as the preview
        // In a real app, you would upload to Supabase Storage
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to complete onboarding.",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)

      try {
        // Save music preferences
        const response = await fetch("/api/user/music-preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            genres: selectedGenres,
            artists: selectedArtists,
            bio,
            imageUrl: imagePreview || undefined,
          }),
        })

        if (response.ok) {
          router.push("/dashboard")
          toast({
            title: "Success!",
            description: "Your profile has been set up.",
          })
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.message || "Failed to save preferences.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Onboarding error:", error)
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MusicIcon className="h-6 w-6" />
            <span className="text-xl font-bold">Ecstasy</span>
          </div>
          <Progress value={progress} className="w-1/2 h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">What music genres do you enjoy?</CardTitle>
                  <CardDescription>Select at least 3 genres that you listen to regularly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        className={`rounded-full ${
                          selectedGenres.includes(genre) ? "bg-gradient-to-r from-pink-500 to-purple-600" : ""
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                        {selectedGenres.includes(genre) && <Check className="ml-2 h-4 w-4" />}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={selectedGenres.length < 3}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Who are your favorite artists?</CardTitle>
                  <CardDescription>Select at least 5 artists that you listen to regularly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {artists.map((artist) => (
                      <Button
                        key={artist}
                        variant={selectedArtists.includes(artist) ? "default" : "outline"}
                        className={`rounded-full ${
                          selectedArtists.includes(artist) ? "bg-gradient-to-r from-pink-500 to-purple-600" : ""
                        }`}
                        onClick={() => toggleArtist(artist)}
                      >
                        {artist}
                        {selectedArtists.includes(artist) && <Check className="ml-2 h-4 w-4" />}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={selectedArtists.length < 5}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Your profile is almost ready!</CardTitle>
                  <CardDescription>Add a profile picture and bio to complete your setup.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background">
                      {imagePreview ? (
                        <Image src={imagePreview || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                      ) : (
                        <MusicIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload image</span>
                        <input
                          type="file"
                          id="profile-image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                      placeholder="Tell others about yourself and your music taste..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {isLoading ? "Saving..." : "Complete Setup"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

