"use client"

import { useState, useCallback } from "react"
import { ChatService } from "../services/chat-service"
import { MessageService } from "../services/message-service"
import type { Chat, Message } from "../types"

/**
 * Custom hook for managing chat state and operations
 * Provides a clean interface for chat functionality in React components
 */
export function useChat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Loads all chats and sets the first one as active if none is selected
   */
  const loadChats = useCallback(async () => {
    try {
      const loadedChats = await ChatService.loadChats()
      setChats(loadedChats)

      // Auto-select first chat if none is currently selected
      if (!currentChatId && loadedChats.length > 0) {
        setCurrentChatId(loadedChats[0].id)
        await loadMessages(loadedChats[0].id)
      }
    } catch (error) {
      console.error("Failed to load chats:", error)
    }
  }, [currentChatId])

  /**
   * Loads messages for a specific chat
   * @param chatId - UUID of the chat to load messages for
   */
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const loadedMessages = await ChatService.loadMessages(chatId)
      setMessages(loadedMessages)
    } catch (error) {
      console.error("Failed to load messages:", error)
      setMessages([])
    }
  }, [])

  /**
   * Creates a new chat and optionally sets it as active
   * @param firstMessage - Optional first message to generate title from
   * @param setAsActive - Whether to set the new chat as the current active chat
   * @returns The new chat ID or null if creation failed
   */
  const createNewChat = useCallback(async (firstMessage?: string, setAsActive = true) => {
    try {
      const newChatId = await ChatService.createNewChat(firstMessage)
      if (!newChatId) return null

      // Create the new chat object for local state
      const newChat: Chat = {
        id: newChatId,
        title: firstMessage
          ? firstMessage.length > 50
            ? firstMessage.substring(0, 50) + "..."
            : firstMessage
          : `Chat ${new Date().toLocaleTimeString()}`,
        created_at: new Date().toISOString(),
      }

      setChats((prev) => [newChat, ...prev])

      if (setAsActive) {
        setCurrentChatId(newChatId)
        setMessages([])
      }

      return newChatId
    } catch (error) {
      console.error("Failed to create new chat:", error)
      return null
    }
  }, [])

  /**
   * Switches to a different chat and loads its messages
   * @param chatId - UUID of the chat to switch to
   */
  const switchToChat = useCallback(
    async (chatId: string) => {
      setCurrentChatId(chatId)
      await loadMessages(chatId)
    },
    [loadMessages],
  )

  /**
   * Sends a message and handles the AI response
   * @param message - The user's message content
   * @returns Promise that resolves when the message is sent and response received
   */
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return

      setIsLoading(true)
      const userMessage = message.trim()

      // Create new chat if none is selected
      let activeChatId = currentChatId
      if (!activeChatId) {
        const newChatId = await createNewChat(userMessage, true)
        if (!newChatId) {
          setIsLoading(false)
          return
        }
        activeChatId = newChatId
      }

      // Add user message to UI immediately
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        content: userMessage,
        role: "user",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])

      try {
        // Send message to AI service
        const botResponse = await MessageService.sendMessage(activeChatId, userMessage)
        setMessages((prev) => [...prev, botResponse])

        // Update chat title if it's auto-generated
        const currentChat = chats.find((chat) => chat.id === activeChatId)
        if (ChatService.shouldUpdateTitle(currentChat!, userMessage)) {
          const newTitle = userMessage.length > 50 ? userMessage.substring(0, 50) + "..." : userMessage

          await ChatService.updateChatTitle(activeChatId, newTitle)
          setChats((prev) => prev.map((chat) => (chat.id === activeChatId ? { ...chat, title: newTitle } : chat)))
        }
      } catch (error) {
        console.error("Error sending message:", error)

        // Add appropriate error message to chat
        let errorMsg;
        if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string") {
          errorMsg =
            (error as any).message === "WEBHOOK_ERROR"
              ? MessageService.createFallbackMessage()
              : MessageService.createErrorMessage(error as Error);
        } else {
          errorMsg = MessageService.createErrorMessage(new Error("Unknown error"));
        }

        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [currentChatId, isLoading, chats, createNewChat],
  )

  return {
    // State
    chats,
    currentChatId,
    messages,
    isLoading,

    // Actions
    loadChats,
    loadMessages,
    createNewChat,
    switchToChat,
    sendMessage,

    // Setters for external control
    setChats,
    setCurrentChatId,
    setMessages,
  }
}
