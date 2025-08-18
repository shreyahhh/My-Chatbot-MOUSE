import { HASURA_CONFIG } from "../constants"
import type { Message } from "../types"

/**
 * Service class for handling message operations
 * Manages sending messages and processing AI responses
 */
export class MessageService {
  /**
   * Sends a message to the AI service via Hasura GraphQL mutation
   * This triggers the n8n webhook which processes the message through AI services
   *
   * @param chatId - UUID of the chat to send the message to
   * @param message - The user's message content
   * @returns Promise<Message> The AI response message
   * @throws Error if the request fails or webhook returns invalid response
   */
  static async sendMessage(chatId: string, message: string): Promise<Message> {
    console.log("[v0] Sending message:", message)
    console.log("[v0] Using chat ID:", chatId)

    // Construct GraphQL mutation with escaped quotes
    const query = `mutation SendMessage { 
      sendMessage(chat_id: "${chatId}", message: "${message.replace(/"/g, '\\"')}") { 
        id 
        chat_id 
        content 
        role 
        created_at 
      } 
    }`

    const response = await fetch(HASURA_CONFIG.ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_CONFIG.ADMIN_SECRET,
        authorization: `Bearer ${HASURA_CONFIG.AUTH_TOKEN}`,
        "X-Hasura-User-Id": HASURA_CONFIG.USER_ID,
        "X-Hasura-Role": "user",
      },
      body: JSON.stringify({ query }),
    })

    const responseText = await response.text()
    let result

    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    if (result.errors) {
      console.error("[v0] GraphQL errors:", result.errors)
      const error = result.errors[0]

      // Handle webhook-specific errors with user-friendly messages
      if (this.isWebhookError(error)) {
        throw new Error("WEBHOOK_ERROR")
      }

      throw new Error(error.message)
    }

    const botResponse = result.data.sendMessage
    return {
      ...botResponse,
      content: botResponse.content.trim(), // Clean up response content
    }
  }

  /**
   * Checks if a GraphQL error is related to webhook failures
   * @param error - GraphQL error object
   * @returns boolean - True if this is a webhook-related error
   */
  private static isWebhookError(error: any): boolean {
    return (
      error.message.includes("not a valid json response from webhook") ||
      error.message.includes("webhook") ||
      error.extensions?.internal?.error?.includes("invalid JSON")
    )
  }

  /**
   * Creates a fallback message when the AI service is unavailable
   * @returns Message - A fallback assistant message
   */
  static createFallbackMessage(): Message {
    return {
      id: `fallback-${Date.now()}`,
      content:
        "I apologize, but I'm currently experiencing technical difficulties with my response system. The webhook service that processes messages is returning empty responses. Please try again in a few moments, or contact support if the issue persists.\n\nIn the meantime, I'd be happy to help once the technical issue is resolved!",
      role: "assistant",
      created_at: new Date().toISOString(),
    }
  }

  /**
   * Creates an error message based on the error type
   * @param error - The error that occurred
   * @returns Message - An error message for display to the user
   */
  static createErrorMessage(error: Error): Message {
    let errorMessage = "Sorry, there was an error sending your message. Please try again."

    if (error.message === "WEBHOOK_ERROR") {
      errorMessage =
        "The AI service is temporarily unavailable due to a backend configuration issue. The message processing webhook is not responding properly. Please try again in a few minutes or contact support."
    } else if (error.message.includes("network") || error.message.includes("fetch")) {
      errorMessage = "Network connection issue. Please check your internet connection and try again."
    } else if (error.message.includes("timeout")) {
      errorMessage = "The request timed out. Please try again with a shorter message."
    }

    return {
      id: `error-${Date.now()}`,
      content: errorMessage,
      role: "assistant",
      created_at: new Date().toISOString(),
    }
  }
}
