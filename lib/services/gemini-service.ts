import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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
  const apiKey = process.env.GEMINI_API_KEY
  return !!(apiKey && apiKey !== 'your-gemini-api-key-here')
}

export async function processFileWithGemini(file: File, userMessage?: string): Promise<string> {
  try {
    // Convert file to Gemini format
    const fileData = await fileToGenerativePart(file)
    
    // Create analysis prompt
    const prompt = createFileAnalysisPrompt(file, userMessage)
    
    const result = await model.generateContent([prompt, fileData])
    return result.response.text()
  } catch (error) {
    console.error('Error processing file:', error)
    throw new Error(`Failed to process ${file.name}`)
  }
}

async function fileToGenerativePart(file: File) {
  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  
  return {
    inlineData: {
      data: base64,
      mimeType: file.type
    }
  }
}

function createFileAnalysisPrompt(file: File, userMessage?: string): string {
  const fileType = file.type.toLowerCase()
  const fileName = file.name
  
  let prompt = ''
  
  if (fileType.startsWith('image/')) {
    prompt = `Analyze this image (${fileName}) and describe what you see in detail.`
  } else if (fileType === 'application/pdf') {
    prompt = `Analyze this PDF document (${fileName}) and provide a comprehensive summary.`
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
    prompt = `Analyze this spreadsheet (${fileName}) and describe the data structure and key insights.`
  } else if (fileType.includes('document') || fileType.includes('word')) {
    prompt = `Analyze this document (${fileName}) and summarize the main content and topics.`
  } else {
    prompt = `Analyze this file (${fileName}) and extract any relevant information.`
  }
  
  if (userMessage?.trim()) {
    prompt += `\n\nSpecific request: "${userMessage}"`
  }
  
  return prompt
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 20 * 1024 * 1024 // 20MB
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: `File too large (${(file.size/1024/1024).toFixed(1)}MB). Max 20MB.` }
  }
  
  const supportedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ]
  
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type}` }
  }
  
  return { valid: true }
}
