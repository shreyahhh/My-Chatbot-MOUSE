'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from "next/image"

export function MouseRunningAnimation() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(new Set<number>())
  const [hasError, setHasError] = useState(false)

  // Define total frames for clarity and easy modification
  const TOTAL_FRAMES = 2;

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Preload images
  useEffect(() => {
    if (!isClient) return

    const preloadImages = () => {
      Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).forEach(frameNum => {
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

  // The key fix is here: The animation logic now only runs ONCE when all images are loaded.
  useEffect(() => {
    // Do not start the animation until the component is mounted and ALL images are preloaded.
    if (!isClient || imagesLoaded.size < TOTAL_FRAMES) {
      return; // Exit if not ready
    }

    // Set up the interval. This code will only run once.
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev % TOTAL_FRAMES) + 1); // Cycles through 1 -> 2 -> 1...
    }, 100);

    // The cleanup will only be called when the component unmounts.
    return () => clearInterval(interval);

  }, [isClient, imagesLoaded]); // The effect re-evaluates when imagesLoaded changes, but the interval only starts when the condition is met.

  const handleImageError = useCallback(() => {
    console.warn(`Mouse image failed to load: mouse${currentFrame}-nobg.png`)
    setHasError(true)
  }, [currentFrame])

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-28 pointer-events-none z-10 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Mouse Animation Container */}
        <div 
          className="absolute bottom-8 w-16 h-12"
          style={{
            animation: 'runAcross 6s linear infinite',
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
              unoptimized={true} 
              onError={handleImageError}
              style={{
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden'
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