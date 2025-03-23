"use client"

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { getFallbackImageUrl } from '@/lib/utils'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackText?: string;
}

export function SafeImage({ 
  src, 
  alt, 
  fallbackText,
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false)
  
  // Generate fallback image URL
  const fallbackSrc = getFallbackImageUrl(
    fallbackText || alt || 'Image', 
    typeof props.width === 'number' ? props.width : 400,
    typeof props.height === 'number' ? props.height : 400
  )
  
  return (
    <Image
      {...props}
      src={error ? fallbackSrc : src}
      alt={alt}
      unoptimized // Important for external URLs
      onError={() => setError(true)}
    />
  )
}
