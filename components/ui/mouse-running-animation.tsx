'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from "next/image"

export function MouseRunningAnimation() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(new Set<number>())
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false) // New state to control the animation start
  const [hasError, setHasError] = useState(false)

  const TOTAL_FRAMES = 2;

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 1. Preload images and update the loaded set
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
          // Even if one fails, we might want to try animating with what we have
          setImagesLoaded(prev => new Set(prev).add(frameNum))
        }
        img.src = `/mouse${frameNum}-nobg.png`
      })
    }
    preloadImages()
  }, [isClient])

  // 2. This new effect watches the loaded images and sets the 'isReady' flag ONCE
  useEffect(() => {
    if (imagesLoaded.size === TOTAL_FRAMES) {
      setIsReadyToAnimate(true);
    }
  }, [imagesLoaded]);

  // 3. The animation effect now ONLY depends on 'isReadyToAnimate'
  // This ensures the interval is created exactly once and never torn down unnecessarily.
  useEffect(() => {
    if (!isReadyToAnimate) {
      return; // Exit if not ready
    }

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev % TOTAL_FRAMES) + 1); // Cycles 1 -> 2 -> 1...
    }, 100);

    return () => clearInterval(interval);
  }, [isReadyToAnimate]); // Only runs when isReadyToAnimate changes from false to true

  const handleImageError = useCallback(() => {
    console.warn(`Mouse image failed to load: mouse${currentFrame}-nobg.png`)
    setHasError(true)
  }, [currentFrame])

  if (!isClient) {
    return null
  }

  // A small improvement: Don't render the animation div until ready.
  if (!isReadyToAnimate && !hasError) {
      return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-28 pointer-events-none z-10 overflow-hidden">
      <div className="relative w-full h-full">
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
              priority // Use priority since this is an important visual element when shown
              unoptimized={true} 
              onError={handleImageError}
              style={{
                imageRendering: 'crisp-edges', // Good for pixel art
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