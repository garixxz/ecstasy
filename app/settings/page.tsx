"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useSession, signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, LogOut, Bell, Shield, Music, User } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    age: "",
    gender: "male",
    lookingFor: "everyone",
    notifications: {
      matches: true,
      messages: true,
      likes: true,
      app: true,
    },
    privacy: {
      showOnlineStatus: true,
      showActivity: true,
      showDistance: true,
    },
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated") {
      // In a real app, fetch user data from API
      // fetchUserData()

      // Using mock data for now
      setTimeout(() => {
        setFormData({
          name: session?.user?.name || "Alex Johnson",
          email: session?.user?.email || "alex@example.com",
          bio: "Indie rock enthusiast and vinyl collector. Looking for someone to share headphones with.",
          age: "28",
          gender: "male",
          lookingFor: "everyone",
          notifications: {
            matches: true,
            messages: true,
            likes: true,
            app: true,
          },
          privacy: {
            showOnlineStatus: true,
            showActivity: true,
            showDistance: true,
          },
        })
        setIsLoading(false)
      }, 1000)
    }
  }, [status, router, session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (category: "notifications" | "privacy", name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: checked,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // In a real app, save to API
      // await fetch('/api/user/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
        <div className="relative w-16 h-16">
          <div className="cassette-loading">
            <div className="cassette-body border-2 border-neon-pink bg-black p-2 rounded-md">
              <div className="cassette-reels flex justify-between">
                <div className="reel w-5 h-5 rounded-full border border-neon-blue animate-spin"></div>
                <div className="reel w-5 h-5 rounded-full border border-neon-blue animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-neon-pink">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
          <TabsTrigger
            value="profile"
            className="text-white data-[state=active]:bg-neon-pink data-[state=active]:text-black"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="text-white data-[state=active]:bg-neon-purple data-[state=active]:text-black"
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card className="border-neon-pink/50 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-zinc-400">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="bg-zinc-900 border-zinc-700 text-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Gender</Label>
                <Tabs
                  value={formData.gender}
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
                  value={formData.lookingFor}
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

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10"
                  onClick={() => router.push("/connect-spotify")}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Update Music Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="border-neon-blue/50 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
              <CardDescription className="text-zinc-400">Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">New Matches</Label>
                  <p className="text-xs text-zinc-400">Receive notifications for new matches</p>
                </div>
                <Switch
                  checked={formData.notifications.matches}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "matches", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Messages</Label>
                  <p className="text-xs text-zinc-400">Receive notifications for new messages</p>
                </div>
                <Switch
                  checked={formData.notifications.messages}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "messages", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Likes</Label>
                  <p className="text-xs text-zinc-400">Receive notifications when someone likes you</p>
                </div>
                <Switch
                  checked={formData.notifications.likes}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "likes", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">App Updates</Label>
                  <p className="text-xs text-zinc-400">Receive notifications about app updates</p>
                </div>
                <Switch
                  checked={formData.notifications.app}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "app", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-4">
          <Card className="border-neon-purple/50 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Privacy Settings</CardTitle>
              <CardDescription className="text-zinc-400">Control your privacy and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Show Online Status</Label>
                  <p className="text-xs text-zinc-400">Allow others to see when you're online</p>
                </div>
                <Switch
                  checked={formData.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => handleSwitchChange("privacy", "showOnlineStatus", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Show Activity</Label>
                  <p className="text-xs text-zinc-400">Allow others to see your recent activity</p>
                </div>
                <Switch
                  checked={formData.privacy.showActivity}
                  onCheckedChange={(checked) => handleSwitchChange("privacy", "showActivity", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Show Distance</Label>
                  <p className="text-xs text-zinc-400">Show your approximate distance to others</p>
                </div>
                <Switch
                  checked={formData.privacy.showDistance}
                  onCheckedChange={(checked) => handleSwitchChange("privacy", "showDistance", checked)}
                />
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button
          className="w-full bg-neon-pink hover:bg-neon-pink/90 text-black font-bold"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

