export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
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
      <p className="mt-4 text-neon-pink">Loading...</p>
    </div>
  )
}

