"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Heart, MessageCircle, Music, Settings, LogOut } from 'lucide-react'
import { SafeImage } from '@/components/ui/safe-image'

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      title: "Discover",
      href: "/dashboard",
      icon: <Music className="mr-2 h-4 w-4" />,
    },
    {
      title: "Matches",
      href: "/matches",
      icon: <Heart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: <MessageCircle className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <nav className={cn("flex flex-col space-y-2", className)} {...props}>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-2 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/") ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    : "",
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
      <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </nav>
  )
}
