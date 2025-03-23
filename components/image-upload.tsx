"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { uploadImageToSupabase } from "@/lib/supabase"
import { Progress } from "@/components/ui/progress"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  initialImage?: string
  userId: string
  bucketName?: string
  maxSizeMB?: number
}

export function ImageUpload({
  onImageUpload,
  initialImage,
  userId,
  bucketName = "profile-images",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB. Your file is ${fileSizeMB.toFixed(2)}MB.`,
        variant: "destructive",
      })
      return
    }

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 200)

      // Upload to Supabase
      const imageUrl = await uploadImageToSupabase(file, bucketName, userId)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (imageUrl) {
        onImageUpload(imageUrl)
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })

      // For development only - use a placeholder
      if (process.env.NODE_ENV === "development") {
        const placeholderUrl = `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(file.name)}`
        onImageUpload(placeholderUrl)
      }
    } finally {
      // Reset progress after a short delay to show 100%
      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
      }, 500)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageUpload("")
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
            onError={() => {
              // Fallback to placeholder if image fails to load
              setPreview(`/placeholder.svg?height=400&width=300&text=Image`)
            }}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={removeImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-4">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
            Drag and drop an image, or click to browse
          </p>
          <Button variant="outline" disabled={isUploading} className="relative">
            {isUploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </Button>
          <p className="text-xs text-gray-500 mt-2">Maximum file size: {maxSizeMB}MB</p>
        </div>
      )}

      {isUploading && (
        <div className="w-full">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center mt-1">Uploading... {Math.round(uploadProgress)}%</p>
        </div>
      )}
    </div>
  )
}

