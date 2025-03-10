"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MusicIcon, UserIcon, MailIcon, LockIcon, ArrowRightIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    lookingFor: "",
    favoriteGenres: [] as string[],
    favoriteArtists: [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        })
        return
      }

      // Password length check
      if (formData.password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        })
        return
      }
    }

    if (step === 2) {
      if (!formData.age || !formData.gender || !formData.lookingFor) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate final step
    if (formData.favoriteGenres.length === 0) {
      toast({
        title: "Select genres",
        description: "Please select at least one music genre",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // In a real app, this would call your API
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // if (!response.ok) {
      //   throw new Error('Failed to create account')
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Account created!",
        description: "Your profile has been created successfully",
      })

      // Sign in the user
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Redirect to discover page
      router.push("/discover")
    } catch (error) {
      console.error("Error creating account:", error)
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const genres = [
    "80s Pop",
    "Synthwave",
    "New Wave",
    "Post-Punk",
    "Disco",
    "Hip Hop",
    "Rock",
    "Alternative",
    "Indie",
    "Electronic",
  ]

  const toggleGenre = (genre: string) => {
    setFormData((prev) => {
      if (prev.favoriteGenres.includes(genre)) {
        return {
          ...prev,
          favoriteGenres: prev.favoriteGenres.filter((g) => g !== genre),
        }
      } else {
        return {
          ...prev,
          favoriteGenres: [...prev.favoriteGenres, genre],
        }
      }
    })
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-neon-purple bg-black cassette-card">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">Create Your Mixtape</CardTitle>
          <CardDescription className="text-center text-zinc-400">
            {step === 1 && "Start by creating your account"}
            {step === 2 && "Tell us about yourself"}
            {step === 3 && "What music do you love?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={handleChange}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">I am</Label>
                  <Tabs
                    defaultValue={formData.gender || "male"}
                    className="w-full"
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
                      <TabsTrigger
                        value="male"
                        className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black"
                      >
                        Male
                      </TabsTrigger>
                      <TabsTrigger
                        value="female"
                        className="text-white data-[state=active]:bg-neon-pink data-[state=active]:text-black"
                      >
                        Female
                      </TabsTrigger>
                      <TabsTrigger
                        value="other"
                        className="text-white data-[state=active]:bg-neon-purple data-[state=active]:text-black"
                      >
                        Other
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Looking for</Label>
                  <Tabs
                    defaultValue={formData.lookingFor || "everyone"}
                    className="w-full"
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, lookingFor: value }))}
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
                      <TabsTrigger
                        value="men"
                        className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black"
                      >
                        Men
                      </TabsTrigger>
                      <TabsTrigger
                        value="women"
                        className="text-white data-[state=active]:bg-neon-pink data-[state=active]:text-black"
                      >
                        Women
                      </TabsTrigger>
                      <TabsTrigger
                        value="everyone"
                        className="text-white data-[state=active]:bg-neon-purple data-[state=active]:text-black"
                      >
                        Everyone
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Favorite Genres</Label>
                  <p className="text-xs text-zinc-400 mb-2">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        type="button"
                        variant="outline"
                        className={`justify-start border-zinc-700 hover:border-neon-pink hover:text-neon-pink transition-all ${
                          formData.favoriteGenres.includes(genre)
                            ? "bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,105,180,0.3)]"
                            : "bg-zinc-900 text-white"
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        <MusicIcon className="mr-2 h-4 w-4" />
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artists" className="text-white">
                    Favorite Artists
                  </Label>
                  <p className="text-xs text-zinc-400 mb-2">Enter artists separated by commas</p>
                  <Input
                    id="artists"
                    placeholder="e.g. Madonna, Prince, The Cure"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    value={formData.favoriteArtists.join(", ")}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        favoriteArtists: e.target.value
                          .split(",")
                          .map((a) => a.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
              disabled={isLoading}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button onClick={handleNext} className="bg-neon-pink hover:bg-neon-pink/90 text-black font-bold">
              Next
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-neon-pink hover:bg-neon-pink/90 text-black font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

