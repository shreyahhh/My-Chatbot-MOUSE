"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle, User, Bot, LogOut } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

interface Chat {
  id: string
  title: string
  created_at: string
}

const parseMarkdown = (text: string) => {
  // First handle double asterisks for bold
  let result = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Then handle single asterisks for italic (but not ones that are part of double asterisks)
  result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>")

  // Split by HTML tags and convert to JSX elements
  const parts = result.split(/(<\/?(?:strong|em)>)/g)

  return parts
    .map((part, index) => {
      if (part === "<strong>") return null
      if (part === "</strong>") return null
      if (part === "<em>") return null
      if (part === "</em>") return null

      // Check if this part should be wrapped in formatting
      const prevPart = parts[index - 1]
      if (prevPart === "<strong>") {
        return <strong key={index}>{part}</strong>
      }
      if (prevPart === "<em>") {
        return <em key={index}>{part}</em>
      }

      return part
    })
    .filter(Boolean)
}

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>("")
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const HASURA_ENDPOINT = "https://bnqvukehntkdxvfennwr.hasura.ap-south-1.nhost.run/v1/graphql"
  const ADMIN_SECRET = "q:cQ&ZJjHzX,9M$&;^U4^SL:SrgWjCk*"
  const AUTH_TOKEN = "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"
  const USER_ID = "ebc66f89-92b2-4ad4-86f6-009f61b437ae"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const storedAuth = localStorage.getItem("chatAuth")
    if (storedAuth) {
      setIsAuthenticated(true)
      loadChats()
    }
  }, [])

  const makeGraphQLRequest = async (query: string, variables: any = {}) => {
    const response = await fetch(HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": ADMIN_SECRET,
        authorization: `Bearer ${AUTH_TOKEN}`,
        "X-Hasura-User-Id": USER_ID,
        "X-Hasura-Role": "user",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const result = await response.json()
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }
    return result.data
  }

  const loadChats = async () => {
    try {
      const query = `
        query GetChats {
          chats(order_by: {created_at: desc}) {
            id
            title
            created_at
          }
        }
      `
      const data = await makeGraphQLRequest(query)
      setChats(data.chats)

      if (!currentChatId && data.chats.length > 0) {
        setCurrentChatId(data.chats[0].id)
        loadMessages(data.chats[0].id)
      }
    } catch (error) {
      console.error("Error loading chats:", error)
    }
  }

  const loadMessages = async (chatId: string) => {
    try {
      const query = `
        query GetMessages($chat_id: uuid!) {
          messages(
            where: {chat_id: {_eq: $chat_id}}
            order_by: {created_at: asc}
          ) {
            id
            content
            role
            created_at
          }
        }
      `
      const data = await makeGraphQLRequest(query, { chat_id: chatId })
      setMessages(data.messages)
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const createNewChat = async () => {
    try {
      const query = `
        mutation CreateChat($title: String!) {
          insert_chats_one(object: {title: $title}) {
            id
            title
            created_at
          }
        }
      `
      const data = await makeGraphQLRequest(query, {
        title: `Chat ${new Date().toLocaleTimeString()}`,
      })

      const newChat = data.insert_chats_one
      setChats((prev) => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      setMessages([])
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentChatId || isLoading) return

    setIsLoading(true)
    const userMessage = inputMessage.trim()
    setInputMessage("")

    try {
      console.log("[v0] Sending message:", userMessage)

      const insertUserMessageMutation = `
        mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
          insert_messages_one(object: {
            chat_id: $chat_id,
            content: $content,
            role: "user"
          }) {
            id
            content
            role
            created_at
          }
        }
      `

      const userMessageData = await makeGraphQLRequest(insertUserMessageMutation, {
        chat_id: currentChatId,
        content: userMessage,
      })

      const savedUserMessage = userMessageData.insert_messages_one
      setMessages((prev) => [...prev, savedUserMessage])

      const mutation = `
        mutation SendMessage($chat_id: uuid!, $message: String!) {
          sendMessage(chat_id: $chat_id, message: $message) {
            id
            chat_id
            content
            role
            created_at
          }
        }
      `

      console.log("[v0] Making sendMessage request with:", { chat_id: currentChatId, message: userMessage })

      const response = await fetch(HASURA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": ADMIN_SECRET,
          authorization: `Bearer ${AUTH_TOKEN}`,
          "X-Hasura-User-Id": USER_ID,
          "X-Hasura-Role": "user",
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            chat_id: currentChatId,
            message: userMessage,
          },
        }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log("[v0] Raw response:", responseText)

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[v0] JSON parse error:", parseError)
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`)
      }

      if (result.errors) {
        console.error("[v0] GraphQL errors:", result.errors)
        throw new Error(result.errors[0].message)
      }

      if (!result.data || !result.data.sendMessage) {
        console.error("[v0] Missing sendMessage data:", result)
        throw new Error("No sendMessage data in response")
      }

      const botResponse = result.data.sendMessage
      console.log("[v0] Bot response received:", botResponse)

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        content: `Sorry, there was an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        role: "assistant",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      console.log("[v0] Login attempt:", { email, password })

      if (email && password) {
        localStorage.setItem("chatAuth", JSON.stringify({ email, userId: USER_ID }))
        setIsAuthenticated(true)
        loadChats()
      } else {
        throw new Error("Please enter email and password")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      console.log("[v0] Signup attempt:", { name, email, password })

      if (name && email && password) {
        localStorage.setItem("chatAuth", JSON.stringify({ email, userId: USER_ID, name }))
        setIsAuthenticated(true)
        loadChats()
      } else {
        throw new Error("Please fill in all fields")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("Signup failed. Please try again.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("chatAuth")
    setIsAuthenticated(false)
    setMessages([])
    setChats([])
    setCurrentChatId("")
    setEmail("")
    setPassword("")
    setName("")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Chat History</h2>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={createNewChat} className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant={currentChatId === chat.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1 h-auto p-3"
                onClick={() => {
                  setCurrentChatId(chat.id)
                  loadMessages(chat.id)
                }}
              >
                <div className="text-left">
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(chat.created_at).toLocaleDateString()}</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {currentChatId ? (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
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
                      <div className="whitespace-pre-wrap">{parseMarkdown(message.content)}</div>
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
                ))}
                {isLoading && (
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
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Chat Selected</h3>
              <p className="text-muted-foreground">Create a new chat or select an existing one to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
