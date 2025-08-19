import { NextRequest, NextResponse } from 'next/server'
import { generateAIChatTitle } from '@/lib/services/gemini-service'

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Generate title request received')
    const { message } = await request.json()
    console.log('[API] Message:', message)

    if (!message || typeof message !== 'string') {
      console.log('[API] Invalid message provided')
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    console.log('[API] Calling generateAIChatTitle...')
    // Generate AI title
    const title = await generateAIChatTitle(message)
    console.log('[API] Generated title:', title)

    return NextResponse.json({ title })
  } catch (error) {
    console.error('Error in generate-title API:', error)
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    )
  }
}
