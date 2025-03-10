"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MusicIcon, Menu, X, LogOut, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neon-purple/50 bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <MusicIcon className="h-6 w-6 text-neon-pink" />
          <span className="text-xl font-bold tracking-wider text-white">ECSTASY</span>
        </Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          {isAuthenticated && (
            <>
              <Link href="/discover" className="text-sm font-medium text-white hover:text-neon-pink transition-colors">
                Discover
              </Link>
              <Link href="/matches" className="text-sm font-medium text-white hover:text-neon-pink transition-colors">
                Matches
              </Link>
              <Link href="/messages" className="text-sm font-medium text-white hover:text-neon-pink transition-colors">
                Messages
              </Link>
            </>
          )}
        </nav>
        <div className="ml-auto md:ml-4 flex gap-2">
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-pink">
                  <User className="h-4 w-4 text-black" />
                </div>
              </Button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-black border border-neon-purple overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{session?.user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-zinc-800"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-white hover:bg-zinc-800"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-800"
                      onClick={() => {
                        signOut({ callbackUrl: "/" })
                        setIsProfileMenuOpen(false)
                      }}
                    >
                      <LogOut className="inline-block mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-neon-blue hover:bg-neon-blue/10">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-neon-pink hover:bg-neon-pink/90 text-black font-bold">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <button className="ml-4 rounded-md p-2 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-black/95 md:hidden">
          <nav className="container flex flex-col gap-6 p-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/discover"
                  className="text-lg font-medium text-white hover:text-neon-pink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Discover
                </Link>
                <Link
                  href="/matches"
                  className="text-lg font-medium text-white hover:text-neon-pink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Matches
                </Link>
                <Link
                  href="/messages"
                  className="text-lg font-medium text-white hover:text-neon-pink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="text-lg font-medium text-white hover:text-neon-pink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="text-lg font-medium text-red-500 hover:text-red-400 text-left"
                  onClick={() => {
                    signOut({ callbackUrl: "/" })
                    setIsMenuOpen(false)
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-lg font-medium text-white hover:text-neon-pink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-lg font-medium text-white hover:text-neon-pink"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

