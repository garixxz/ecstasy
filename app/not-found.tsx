import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="relative w-24 h-24 mb-6">
        <div className="cassette-body border-2 border-neon-pink bg-black p-4 rounded-md">
          <div className="cassette-reels flex justify-between">
            <div className="reel w-6 h-6 rounded-full border border-neon-blue"></div>
            <div className="reel w-6 h-6 rounded-full border border-neon-blue"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-neon-pink text-4xl">404</span>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-zinc-400 mb-6 text-center max-w-md">
        The mixtape you're looking for seems to be missing. It might have been rewound too far.
      </p>
      <Link href="/">
        <Button className="bg-neon-pink hover:bg-neon-pink/90 text-black font-bold">Back to Home</Button>
      </Link>
    </div>
  )
}

