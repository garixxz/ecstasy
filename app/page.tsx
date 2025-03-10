import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Find Your Perfect <span className="text-neon-pink">Mixtape</span> Match
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect with people who share your musical taste. Discover new relationships through the power of
                    music.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-neon-pink hover:bg-neon-pink/90 text-black font-bold">
                      Create Your Mixtape
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                    >
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px]">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-3xl"></div>
                  <div className="relative bg-black border-8 border-black rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,105,180,0.5)]">
                    <div className="bg-gradient-to-b from-neon-purple to-neon-blue p-1">
                      <div className="bg-black p-2">
                        <div className="flex justify-between items-center mb-2">
                          <div className="w-16 h-1 bg-neon-pink"></div>
                          <div className="w-16 h-1 bg-neon-blue"></div>
                        </div>
                        <div className="relative aspect-[3/2] bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=300&width=400"
                            alt="Retro cassette tape"
                            fill
                            className="object-cover mix-blend-overlay opacity-70"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-2xl font-bold text-white text-center px-4 tracking-widest">
                              ECSTASY MIXTAPE
                            </h3>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="w-12 h-12 rounded-full bg-black border-2 border-neon-pink flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-neon-pink"></div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-black border-2 border-neon-blue flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-neon-blue"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  How <span className="text-neon-pink">Ecstasy</span> Works
                </h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find your perfect match through the universal language of music
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center space-y-4 p-6 border border-neon-purple rounded-lg bg-black/50">
                <div className="w-16 h-16 rounded-full bg-neon-pink flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">Create Your Mixtape</h3>
                <p className="text-zinc-400 text-center">
                  Build your profile and add your favorite tracks, artists, and genres to your personal mixtape.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 border border-neon-blue rounded-lg bg-black/50">
                <div className="w-16 h-16 rounded-full bg-neon-blue flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Discover Matches</h3>
                <p className="text-zinc-400 text-center">
                  Our algorithm finds people who share your musical taste or complement your unique sound.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 border border-neon-purple rounded-lg bg-black/50">
                <div className="w-16 h-16 rounded-full bg-neon-pink flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">Connect & Vibe</h3>
                <p className="text-zinc-400 text-center">
                  Chat, share songs, and meet up with your matches to see if you have chemistry beyond the music.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-black border-t border-neon-purple">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">© 2025 Ecstasy. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

