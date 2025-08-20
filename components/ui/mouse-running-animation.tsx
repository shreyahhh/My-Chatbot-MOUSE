'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"

export function MouseRunningAnimation() {
  const [currentFrame, setCurrentFrame] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => prev === 1 ? 2 : 1)
    }, 100) // Switch frames every 100ms for running effect

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 w-full h-20 pointer-events-none z-10">
      <div className="absolute w-16 h-12 bottom-2 animate-runAcross">
        <Image
          src={`/mouse${currentFrame}-nobg.png`}
          alt={`Running mouse frame ${currentFrame}`}
          fill
          className="object-contain drop-shadow-md"
          onError={(e) => {
            // Fallback to emoji if image fails
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🐭</div>';
            }
          }}
        />
      </div>
    </div>
  )
}
