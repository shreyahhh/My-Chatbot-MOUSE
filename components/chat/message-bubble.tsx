import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import type { Message } from "@/lib/types"

interface MessageBubbleProps {
  message: Message
}

const parseMarkdownInline = (text: string) => {
  const parts = []
  const currentText = text

  // Handle bold text (**text**)
  const boldRegex = /\*\*(.*?)\*\*/g
  const boldMatches = [...currentText.matchAll(boldRegex)]

  if (boldMatches.length === 0) {
    // Handle italic text (*text*)
    const italicRegex = /\*([^*]+?)\*/g
    const italicMatches = [...currentText.matchAll(italicRegex)]

    if (italicMatches.length === 0) {
      return <span>{text}</span>
    }

    let lastIndex = 0
    italicMatches.forEach((match, index) => {
      if (match.index !== undefined) {
        if (match.index > lastIndex) {
          parts.push(currentText.slice(lastIndex, match.index))
        }
        parts.push(<em key={`italic-${index}`}>{match[1]}</em>)
        lastIndex = match.index + match[0].length
      }
    })

    if (lastIndex < currentText.length) {
      parts.push(currentText.slice(lastIndex))
    }

    return <>{parts}</>
  }

  let lastIndex = 0
  boldMatches.forEach((match, index) => {
    if (match.index !== undefined) {
      if (match.index > lastIndex) {
        parts.push(currentText.slice(lastIndex, match.index))
      }
      parts.push(<strong key={`bold-${index}`}>{match[1]}</strong>)
      lastIndex = match.index + match[0].length
    }
  })

  if (lastIndex < currentText.length) {
    parts.push(currentText.slice(lastIndex))
  }

  return <>{parts}</>
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <div className="whitespace-pre-wrap">{parseMarkdownInline(message.content)}</div>
        <div className="text-xs opacity-70 mt-1">{new Date(message.created_at).toLocaleTimeString()}</div>
      </div>
      {message.role === "user" && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
