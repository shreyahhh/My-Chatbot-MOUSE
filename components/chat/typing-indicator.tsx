import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

interface TypingIndicatorProps {
  isComplete?: boolean
}

export function TypingIndicator({ isComplete = false }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="w-14 h-14">
        <AvatarFallback className="border-none">
          {isComplete ? (
            <Image
              src="/mouse3-nobg.png"
              alt="MouseAI"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : (
            <div className="relative w-12 h-12 overflow-hidden">
              <Image
                src="/mouse1-nobg.png"
                alt="MouseAI Loading Frame 1"
                width={48}
                height={48}
                className="absolute inset-0 w-12 h-12 object-contain animate-mouseFrame1"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <Image
                src="/mouse2-nobg.png"
                alt="MouseAI Loading Frame 2"
                width={48}
                height={48}
                className="absolute inset-0 w-12 h-12 object-contain animate-mouseFrame2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          {/* Fallback emoji - hidden by default, shown if images fail */}
          <div className="fallback-emoji w-12 h-12 flex items-center justify-center text-2xl" style={{ display: 'none' }}>
            🐭
          </div>
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
