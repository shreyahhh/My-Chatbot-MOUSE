# Gemini API Setup Guide

## Getting Your Gemini API Key

1. **Go to Google AI Studio**
   - Visit [https://aistudio.google.com/](https://aistudio.google.com/)
   - Sign in with your Google account

2. **Create API Key**
   - Click on "Get API key" in the left sidebar
   - Click "Create API key"
   - Choose "Create API key in new project" or select existing project
   - Copy your API key

3. **Add to Environment Variables**
   Update your `.env.local` file:
   ```bash
   GEMINI_API_KEY=your-actual-api-key-here
   ```

4. **For Netlify Deployment**
   Add the environment variable in your Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add: `GEMINI_API_KEY` = `your-actual-api-key-here`

## How It Works

- **Smart Title Generation**: When users send their first message, Gemini AI analyzes the content and generates a concise, descriptive title (3-6 words)
- **Fallback System**: If Gemini API is unavailable or not configured, the system falls back to rule-based title generation
- **Async Processing**: Title generation happens in the background so the chat experience remains fast
- **Visual Feedback**: Users see "Generating title..." with a spinner while AI processes the request

## Examples

| First Message | AI-Generated Title |
|---------------|-------------------|
| "How do I bake chocolate chip cookies?" | "Chocolate Chip Cookie Recipe" |
| "Help me debug this React error" | "React Error Debugging" |
| "What's the weather like today?" | "Today's Weather Inquiry" |
| "Explain quantum physics basics" | "Quantum Physics Basics" |

## Cost Information

- Gemini API has a generous free tier
- First 1,500 requests per day are free
- Perfect for personal projects and small applications

## Troubleshooting

- **API Key Issues**: Make sure your API key is correctly set and has no extra spaces
- **Network Errors**: The system will automatically fall back to rule-based titles
- **Rate Limits**: If you exceed limits, titles will use the fallback system until reset
