"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { MusicIcon, Upload } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { toast } from "sonner"
import Image from "next/image"
import { uploadImageToSupabase } from "@/lib/supabase"
import { MultiImageUpload } from "@/components/multi-image-upload"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [userImages, setUserImages] = useState<string[]>([])
  const [showAddImage, setShowAddImage] = useState(false)

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    imageUrl: "",
    genres: [] as string[],
    artists: [] as string[],
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch("/api/user/profile")
        const userData = await userResponse.json()

        if (userResponse.ok) {
          // Fetch music preferences
          const musicResponse = await fetch("/api/user/music-preferences")
          const musicData = await musicResponse.json()

          // Fetch user images
          const imagesResponse = await fetch("/api/user/images")
          const imagesData = await imagesResponse.json()

          if (musicResponse.ok) {
            setProfile({
              name: userData.data.name || "",
              email: userData.data.email || "",
              bio: userData.data.bio || "",
              location: userData.data.location || "",
              imageUrl: userData.data.imageUrl || "",
              genres: musicData.data.genres || [],
              artists: musicData.data.artists || [],
            })

            if (userData.data.imageUrl) {
              setImagePreview(userData.data.imageUrl)
            }

            if (imagesResponse.ok && imagesData.images) {
              setUserImages(imagesData.images)
            }
          }
        } else {
          toast.error(userData.error || "Failed to fetch profile")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // If there's a new image, upload it to Supabase
      let imageUrl = profile.imageUrl
      if (imageFile) {
        const uploadedUrl = await uploadImageToSupabase(imageFile, "profile-images", session?.user?.id || "anonymous")

        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          // Fallback to placeholder for development
          imageUrl = `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(profile.name)}`
        }
      }

      // Update user profile
      const userResponse = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          location: profile.location,
          imageUrl,
        }),
      })

      if (userResponse.ok) {
        toast.success("Profile updated successfully")
      } else {
        const userData = await userResponse.json()
        toast.error(userData.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddImage = (url: string) => {
    if (url) {
      setUserImages([...userImages, url])
      setShowAddImage(false)

      // Save the new image to the user's profile
      saveUserImage(url)
    }
  }

  const saveUserImage = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/user/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save image")
      }
    } catch (error) {
      console.error("Error saving image:", error)
      toast.error("Failed to save image. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MusicIcon className="h-6 w-6" />
            <span className="text-xl font-bold">Ecstasy</span>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Profile</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-900">
                        {imagePreview ? (
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Profile"
                            fill
                            className="object-cover"
                            unoptimized
                            onError={() => {
                              // Fallback to placeholder if image fails to load
                              setImagePreview(
                                `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(profile.name || "User")}`,
                              )
                            }}
                          />
                        ) : (
                          <MusicIcon className="h-12 w-12 text-gray-400" />
                        )}
                        <label
                          htmlFor="profile-image"
                          className="absolute bottom-0 right-0 bg-black dark:bg-white text-white dark:text-black p-1 rounded-full cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={profile.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={profile.email} disabled />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        className="w-full min-h-[100px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" value={profile.location} onChange={handleChange} />
                    </div>
                    <Button
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Your Photos</CardTitle>
                  <CardDescription>Add photos to your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MultiImageUpload
                    initialImages={userImages}
                    userId={session?.user?.id || "anonymous"}
                    onImagesChange={(urls) => {
                      setUserImages(urls)
                      // Save each new image
                      urls.forEach((url) => {
                        if (!userImages.includes(url)) {
                          saveUserImage(url)
                        }
                      })
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Add photos to your profile to increase your chances of getting matches.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Music Preferences</CardTitle>
                  <CardDescription>Your selected genres and artists</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Your Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.genres.map((genre) => (
                        <span key={genre} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Your Artists</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.artists.map((artist) => (
                        <span key={artist} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                          {artist}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => (window.location.href = "/onboarding")}>Update Music Preferences</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

