"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, getFallbackImageUrl } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  className?: string
  aspectRatio?: "square" | "portrait" | "landscape"
  userName?: string
}

export function ImageGallery({ images, className, aspectRatio = "square", userName = "User" }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  // Filter out empty image URLs and ensure we have at least one image
  const validImages = images.filter((img) => !!img)

  // If no valid images, show a placeholder
  if (validImages.length === 0) {
    validImages.push(getFallbackImageUrl(userName, 400, 400))
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  const getImageSrc = (index: number) => {
    return imageErrors[index] ? getFallbackImageUrl(userName, 400, 400) : validImages[index]
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  // Map aspect ratio to Tailwind classes
  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }

  return (
    <>
      <div className={cn("relative overflow-hidden rounded-md", aspectRatioClasses[aspectRatio], className)}>
        <div className="relative h-full w-full cursor-pointer" onClick={() => setViewerOpen(true)}>
          <Image
            src={getImageSrc(currentIndex) || "/placeholder.svg"}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            unoptimized
            onError={() => handleImageError(currentIndex)}
          />

          {validImages.length > 1 && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {validImages.map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-1.5 w-1.5 rounded-full", i === currentIndex ? "bg-white" : "bg-white/50")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {viewerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setViewerOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-auto h-[80vh] w-full">
              <Image
                src={getImageSrc(currentIndex) || "/placeholder.svg"}
                alt={`Image ${currentIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
                onError={() => handleImageError(currentIndex)}
              />

              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={() => setViewerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>

              {validImages.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {validImages.map((_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={i === currentIndex ? "default" : "outline"}
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => setCurrentIndex(i)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

