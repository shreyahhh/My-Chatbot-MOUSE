import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import { MESSAGE_LIMITS } from "@/lib/constants"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg p-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-current rounded-full animate-bounce"
            style={{ animationDelay: `${MESSAGE_LIMITS.TYPING_ANIMATION_DELAY}s` }}
          ></div>
          <div
            className="w-2 h-2 bg-current rounded-full animate-bounce"
            style={{ animationDelay: `${MESSAGE_LIMITS.TYPING_ANIMATION_DELAY * 2}s` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
