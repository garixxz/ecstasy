"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MailIcon, LockIcon, MusicIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        throw new Error("Invalid email or password")
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in",
      })

      router.push("/discover")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-neon-purple bg-black cassette-card">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-black border-2 border-neon-pink flex items-center justify-center">
              <MusicIcon className="h-8 w-8 text-neon-pink" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-white">Welcome Back</CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Sign in to continue your musical journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs text-neon-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-neon-pink hover:bg-neon-pink/90 text-black font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-zinc-400 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-neon-blue hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

