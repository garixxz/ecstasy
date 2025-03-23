import type { ImageLoaderProps } from "next/image"

/**
 * Custom image loader for Supabase Storage
 * This allows Next.js Image component to work with Supabase Storage URLs
 * and apply transformations like resizing
 */
export function supabaseImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Check if the image is already a Supabase URL
  if (src.includes("supabase.co/storage/v1/object/public")) {
    // Parse the URL to extract the bucket and path
    const url = new URL(src)
    const pathname = url.pathname

    // Add width and quality parameters
    url.searchParams.set("width", width.toString())
    url.searchParams.set("quality", (quality || 75).toString())

    return url.href
  }

  // For non-Supabase URLs, return as is
  return src
}

/**
 * Checks if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false

  // Check if it's a URL
  try {
    new URL(url)
  } catch (e) {
    return false
  }

  // Check if it's an image URL (basic check)
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
  return (
    imageExtensions.some((ext) => url.toLowerCase().includes(ext)) ||
    url.includes("supabase.co/storage/v1/object/public") ||
    url.includes("placeholder.svg")
  )
}

/**
 * Gets a public URL for a Supabase Storage file
 */
export function getSupabasePublicUrl(bucketName: string, filePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    return ""
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`
}

