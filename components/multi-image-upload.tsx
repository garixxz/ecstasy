"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Plus } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { uploadImageToSupabase } from "@/lib/supabase"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void
  initialImages?: string[]
  userId: string
  bucketName?: string
  maxSizeMB?: number
  maxImages?: number
}

export function MultiImageUpload({
  onImagesChange,
  initialImages = [],
  userId,
  bucketName = "profile-images",
  maxSizeMB = 5,
  maxImages = 6,
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState<Record<string, number>>({})
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images.`,
        variant: "destructive",
      })
      return
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = `${Date.now()}-${i}`

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${maxSizeMB}MB. ${file.name} is ${fileSizeMB.toFixed(2)}MB.`,
          variant: "destructive",
        })
        continue
      }

      // Start upload tracking
      setUploading((prev) => ({ ...prev, [fileId]: 0 }))

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploading((prev) => ({
            ...prev,
            [fileId]: Math.min(90, (prev[fileId] || 0) + Math.random() * 10),
          }))
        }, 200)

        // Upload to Supabase
        const imageUrl = await uploadImageToSupabase(file, bucketName, `${userId}/gallery`)

        clearInterval(progressInterval)
        setUploading((prev) => ({ ...prev, [fileId]: 100 }))

        if (imageUrl) {
          // Add the new image URL
          const newImages = [...images, imageUrl]
          setImages(newImages)
          onImagesChange(newImages)
        } else {
          throw new Error(`Failed to upload ${file.name}`)
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive",
        })

        // For development only - use a placeholder
        if (process.env.NODE_ENV === "development") {
          const placeholderUrl = `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(file.name)}`
          const newImages = [...images, placeholderUrl]
          setImages(newImages)
          onImagesChange(newImages)
        }
      } finally {
        // Remove from uploading state after a delay
        setTimeout(() => {
          setUploading((prev) => {
            const newState = { ...prev }
            delete newState[fileId]
            return newState
          })
        }, 500)
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-72 w-full rounded-md border">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={`User image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  // Replace with placeholder if image fails to load
                  ;(e.target as HTMLImageElement).src = `/placeholder.svg?height=200&width=200&text=Image${index + 1}`
                }}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {/* Upload button */}
          {images.length < maxImages && (
            <div className="aspect-square relative">
              <Button
                variant="outline"
                className="w-full h-full flex flex-col items-center justify-center gap-2 border-dashed"
                disabled={Object.keys(uploading).length > 0}
              >
                <Plus className="h-8 w-8" />
                <span>Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  disabled={Object.keys(uploading).length > 0}
                />
              </Button>
            </div>
          )}

          {/* Progress indicators for uploads in progress */}
          {Object.entries(uploading).map(([id, progress]) => (
            <div
              key={id}
              className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col items-center justify-center p-4"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <Progress value={progress} className="w-full h-2 mb-2" />
              <p className="text-xs text-center">Uploading... {Math.round(progress)}%</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <p className="text-sm text-gray-500">
        {images.length} of {maxImages} images uploaded.
        {images.length < maxImages && ` You can upload ${maxImages - images.length} more.`}
      </p>
    </div>
  )
}

