'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from "next/image"

export function MouseRunningAnimation() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(new Set<number>())
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageErrors, setImageErrors] = useState(new Set<number>())

  const TOTAL_FRAMES = 2;

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Preload images with better error handling
  useEffect(() => {
    if (!isClient) return

    const preloadImages = () => {
      const loadPromises = Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map(frameNum => {
        return new Promise<number>((resolve, reject) => {
          const img = new window.Image()
          
          img.onload = () => {
            console.log(`Successfully loaded mouse${frameNum}-nobg.png`)
            resolve(frameNum)
          }
          
          img.onerror = () => {
            console.error(`Failed to preload mouse${frameNum}-nobg.png`)
            setImageErrors(prev => new Set(prev).add(frameNum))
            reject(frameNum)
          }
          
          // Add cache busting and proper path
          img.src = `/mouse${frameNum}-nobg.png?v=${Date.now()}`
        })
      })

      // Wait for all images or handle partial loading
      Promise.allSettled(loadPromises).then(results => {
        const successfulLoads = results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<number>).value)
        
        if (successfulLoads.length > 0) {
          setImagesLoaded(new Set(successfulLoads))
          console.log(`Loaded ${successfulLoads.length}/${TOTAL_FRAMES} images`)
        } else {
          console.error('No images could be loaded')
          setHasError(true)
        }
      })
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(preloadImages, 100)
    return () => clearTimeout(timer)
  }, [isClient])

  // Set ready state when images are loaded
  useEffect(() => {
    if (imagesLoaded.size > 0) { // Allow animation even if not all images loaded
      setIsReadyToAnimate(true)
    }
  }, [imagesLoaded])

  // Animation effect with better frame cycling
  useEffect(() => {
    if (!isReadyToAnimate || hasError) {
      return
    }

    console.log('Starting animation with frames:', Array.from(imagesLoaded))
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        const availableFrames = Array.from(imagesLoaded).sort()
        if (availableFrames.length === 0) return prev
        
        const currentIndex = availableFrames.indexOf(prev)
        const nextIndex = (currentIndex + 1) % availableFrames.length
        const nextFrame = availableFrames[nextIndex]
        
        console.log(`Switching from frame ${prev} to frame ${nextFrame}`)
        return nextFrame
      })
    }, 150) // Slightly slower for better visibility

    return () => {
      console.log('Cleaning up animation interval')
      clearInterval(interval)
    }
  }, [isReadyToAnimate, hasError, imagesLoaded])

  const handleImageError = useCallback((frameNum: number) => {
    console.error(`Image error for frame ${frameNum}`)
    setImageErrors(prev => new Set(prev).add(frameNum))
    
    // If all images fail, show fallback
    if (imageErrors.size + 1 >= TOTAL_FRAMES) {
      setHasError(true)
    }
  }, [imageErrors.size])

  if (!isClient) {
    return null
  }

  // Show loading state
  if (!isReadyToAnimate && !hasError) {
    return (
      <div className="fixed bottom-0 left-0 w-full h-28 pointer-events-none z-10 overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute bottom-8 left-4 w-16 h-12 flex items-center justify-center">
            <div className="text-2xl animate-pulse">🐭</div>
          </div>
        </div>
      </div>
    )
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
          {!hasError && imagesLoaded.has(currentFrame) ? (
            <img
              src={`/mouse${currentFrame}-nobg.png`}
              alt={`Running mouse frame ${currentFrame}`}
              width={64}
              height={48}
              className="object-contain drop-shadow-lg"
              onError={() => handleImageError(currentFrame)}
              style={{
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden',
                width: '64px',
                height: '48px'
              }}
              key={`mouse-frame-${currentFrame}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl animate-bounce">
              🐭
            </div>
          )}
        </div>
      </div>
      
      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes runAcross {
          0% { 
            left: -64px; 
            transform: scaleX(1);
          }
          48% { 
            left: calc(100% - 32px); 
            transform: scaleX(1);
          }
          50% { 
            left: calc(100% - 32px); 
            transform: scaleX(-1);
          }
          98% { 
            left: -64px; 
            transform: scaleX(-1);
          }
          100% { 
            left: -64px; 
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  )
}