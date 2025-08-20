'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from "next/image"

export function MouseRunningAnimation() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(new Set<number>())
  const [hasError, setHasError] = useState(false)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Preload images for better performance
  useEffect(() => {
    if (!isClient) return

    const preloadImages = () => {
      [1, 2].forEach(frameNum => {
        const img = new window.Image()
        img.onload = () => {
          setImagesLoaded(prev => new Set(prev).add(frameNum))
        }
        img.onerror = () => {
          console.warn(`Failed to preload mouse${frameNum}-nobg.png`)
        }
        img.src = `/mouse${frameNum}-nobg.png`
      })
    }

    preloadImages()
  }, [isClient])

  // Animation logic
  useEffect(() => {
    if (!isClient || imagesLoaded.size === 0) return

    const interval = setInterval(() => {
      setCurrentFrame(prev => prev === 1 ? 2 : 1)
    }, 200) // Slower animation for better visibility

    return () => clearInterval(interval)
  }, [isClient, imagesLoaded.size])

  const handleImageError = useCallback(() => {
    console.warn(`Mouse image failed to load: mouse${currentFrame}-nobg.png`)
    setHasError(true)
  }, [currentFrame])

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-24 pointer-events-none z-10 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Mouse Animation Container */}
        <div 
          className="absolute bottom-8 w-16 h-12"
          style={{
            animation: 'runAcross 12s linear infinite',
            animationFillMode: 'forwards'
          }}
        >
          {!hasError ? (
            <Image
              src={`/mouse${currentFrame}-nobg.png`}
              alt={`Running mouse frame ${currentFrame}`}
              width={64}
              height={48}
              className="object-contain drop-shadow-lg"
              priority={false}
              unoptimized={true} // Better for production deployment
              onError={handleImageError}
              style={{
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden' // Prevent flicker
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl animate-bounce">
              🐭
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
