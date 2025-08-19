import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Generates an intelligent chat title using Gemini AI
 * @param firstMessage - The first message in the chat
 * @returns Promise<string> - A concise, descriptive title
 */
export async function generateAIChatTitle(firstMessage: string): Promise<string> {
  try {
    console.log('[Gemini] Starting title generation for:', firstMessage.substring(0, 50) + '...')
    
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY
    console.log('[Gemini] API key configured:', !!apiKey)
    console.log('[Gemini] API key length:', apiKey?.length || 0)
    
    // Fallback if no API key is configured
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      console.warn('[Gemini] API key not configured, using fallback title generation')
      return generateFallbackTitle(firstMessage)
    }

    console.log('[Gemini] Initializing Gemini AI...')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Generate a concise, descriptive title (3-6 words) for a chat conversation based on this first message:

"${firstMessage}"

Requirements:
- Maximum 6 words
- Descriptive and specific
- No quotation marks
- Capitalize appropriately
- Focus on the main topic/intent

Examples:
- "How to bake chocolate chip cookies" → "Chocolate Chip Cookie Recipe"
- "Help me debug my React code" → "React Code Debugging Help"
- "What's the weather like today?" → "Today's Weather Inquiry"
- "Explain quantum physics basics" → "Quantum Physics Basics"

Generate only the title, nothing else:`

    console.log('[Gemini] Sending request to Gemini...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const title = response.text().trim()
    
    console.log('[Gemini] Received response:', title)

    // Validate and clean the response
    if (title && title.length > 0 && title.length <= 50) {
      // Remove any quotation marks and ensure proper capitalization
      const cleanTitle = title.replace(/['"]/g, '').trim()
      console.log('[Gemini] Returning clean title:', cleanTitle)
      return cleanTitle
    } else {
      console.warn('[Gemini] Invalid title received, using fallback. Title:', title)
      return generateFallbackTitle(firstMessage)
    }
  } catch (error) {
    console.error('[Gemini] Error generating AI title:', error)
    return generateFallbackTitle(firstMessage)
  }
}

/**
 * Fallback title generation when AI is unavailable
 */
function generateFallbackTitle(firstMessage: string): string {
  if (!firstMessage?.trim()) {
    return `Chat ${new Date().toLocaleTimeString()}`
  }

  let cleanMessage = firstMessage.trim()

  // Remove common prefixes
  const prefixesToRemove = [
    "can you", "could you", "would you", "will you", "please",
    "help me", "i need", "how do i", "what is", "what are",
    "tell me", "explain", "show me"
  ]

  const lowerMessage = cleanMessage.toLowerCase()
  for (const prefix of prefixesToRemove) {
    if (lowerMessage.startsWith(prefix)) {
      cleanMessage = cleanMessage.substring(prefix.length).trim()
      break
    }
  }

  // Capitalize first letter
  if (cleanMessage.length > 0) {
    cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1)
  }

  // Truncate to reasonable length
  if (cleanMessage.length > 40) {
    const truncated = cleanMessage.substring(0, 40)
    const lastSpaceIndex = truncated.lastIndexOf(" ")
    
    if (lastSpaceIndex > 28) {
      return truncated.substring(0, lastSpaceIndex) + "..."
    }
    return truncated + "..."
  }

  return cleanMessage || `Chat ${new Date().toLocaleTimeString()}`
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here')
}
