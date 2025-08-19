
# mouse: NHost + Hasura GraphQL Chat Application

A modern, secure multi-user chat application built with N#### `messages` table
```sql
CREATE TABLE messages (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
   user_id UUID REFERENCES auth.users(id),
   content TEXT NOT NULL,
   role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Primary Key: messages_pkey (id)
-- Foreign Key: chat_id → chats.id (messages_chat_id_fkey)
-- Foreign Key: user_id → auth.users.id (messages_user_id_fkey)
-- Index: CREATE INDEX ON messages(chat_id);
-- Index: CREATE INDEX ON messages(user_id);
-- Trigger: notify_hasura_user_message_trigger AFTER INSERT ON messages
```

### Row-Level Security (RLS) Setup

To ensure users only see their own data, configure RLS policies:

#### For `chats` table:
```sql
-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their chats
CREATE POLICY "Users can view own chats" ON chats
   FOR SELECT USING (user_id = auth.uid());

-- Policy for users to create their own chats
CREATE POLICY "Users can create own chats" ON chats
   FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own chats
CREATE POLICY "Users can update own chats" ON chats
   FOR UPDATE USING (user_id = auth.uid());
```

#### For `messages` table:
```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their messages
CREATE POLICY "Users can view own messages" ON messages
   FOR SELECT USING (user_id = auth.uid());

-- Policy for users to create their own messages
CREATE POLICY "Users can create own messages" ON messages
   FOR INSERT WITH CHECK (user_id = auth.uid());
```authentication, Hasura GraphQL, and n8n automation workflows. This application demonstrates a complete full-stack implementation with Row-Level Security, real-time messaging, and AI-powered responses.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│  NHost Auth +   │───▶│   n8n Webhook   │───▶│   AI Service    │
│   (Frontend)    │    │  Hasura GraphQL │    │  (Automation)   │    │  (OpenAI/etc)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         └─────────────▶│  NHost Database │
                        │  (PostgreSQL)   │
                        └─────────────────┘
```

## 🚀 Features

### Core Functionality
- **Multi-User Authentication**: Secure user registration and login with email verification
- **Row-Level Security**: Each user only sees their own chats and messages
- **Real-time Chat Interface**: Modern, responsive chat UI with message bubbles
- **AI-Powered Chat Titles**: Intelligent chat naming using Google Gemini AI
- **Auto-naming Chats**: Smart fallback system for chat title generation
- **Message History**: Persistent chat history with PostgreSQL storage
- **Markdown Support**: Rich text formatting with **bold** and *italic* support
- **Typing Indicators**: Visual feedback during message processing
- **Error Handling**: Comprehensive error handling with user-friendly messages

### AI Features
- **Gemini Integration**: Google's Gemini AI analyzes first messages to generate descriptive titles
- **Smart Fallback**: Rule-based title generation when AI is unavailable
- **Async Processing**: Title generation happens in background for smooth UX
- **Visual Feedback**: Loading indicators show when AI is generating titles

### Security Features
- **JWT Authentication**: Secure token-based authentication via NHost
- **Email Verification**: Users must verify their email before accessing the app
- **Environment Variables**: All sensitive data stored in .env.local
- **Row-Level Security**: Database-level security ensuring data isolation

### Technical Features
- **GraphQL Integration**: Efficient data fetching with Hasura GraphQL Engine
- **Webhook Automation**: n8n workflows for AI response processing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable React components

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **Lucide React**: Beautiful icon library
- **@nhost/react**: NHost React integration

### Backend Services
- **NHost**: Backend-as-a-Service with authentication
- **Hasura GraphQL Engine**: Real-time GraphQL API with RLS
- **PostgreSQL**: Relational database
- **n8n**: Workflow automation platform

### AI Integration
- **OpenAI API**: AI-powered chat responses
- **Custom Webhooks**: Integration layer between Hasura and AI services

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js 18+ installed
- NHost account and project setup
- Access to the configured services:
  - NHost project with PostgreSQL database
  - Hasura GraphQL Engine instance (via NHost)
  - n8n workflow automation setup
  - AI service API keys (OpenAI, etc.)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# NHost Configuration (Required)
NEXT_PUBLIC_NHOST_SUBDOMAIN=your-nhost-subdomain
NEXT_PUBLIC_NHOST_REGION=your-nhost-region

# Gemini AI Configuration (Optional - for intelligent chat titles)
GEMINI_API_KEY=your-gemini-api-key
```

### API Keys Setup

#### NHost (Required)
1. Create account at [nhost.io](https://nhost.io)
2. Create new project
3. Get subdomain and region from project dashboard

#### Gemini AI (Optional but Recommended)
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Create API key
4. Add to `.env.local`

**Note**: If Gemini API key is not provided, the app will use smart rule-based title generation as fallback.

### NHost Setup

1. Create a new NHost project
2. Note your subdomain and region
3. Configure your database schema (see below)
4. Set up Hasura Row-Level Security permissions

### Database Schema

The application requires the following PostgreSQL tables:

#### `chats` table
```sql
CREATE TABLE chats (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID REFERENCES auth.users(id),
   title TEXT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Primary Key: chats_pkey (id)
-- Foreign Key: user_id → auth.users.id (chats_user_id_fkey)
```

#### `messages` table
```sql
CREATE TABLE messages (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
   content TEXT NOT NULL,
   role TEXT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Primary Key: messages_pkey (id)
-- Foreign Key: chat_id → chats.id (messages_chat_id_fkey)
-- Index: CREATE INDEX ON messages(chat_id);
-- Trigger: notify_hasura_user_message_trigger AFTER INSERT ON messages
```

### Hasura Configuration

#### GraphQL Queries and Mutations

The application uses these GraphQL operations:

**Queries:**
- `GetChats`: Retrieves all chats ordered by creation date
- `GetMessages`: Fetches messages for a specific chat

**Mutations:**
- `CreateChat`: Creates a new chat with a title
- `UpdateChatTitle`: Updates an existing chat's title
- `SendMessage`: Triggers the AI response workflow (custom action)

#### Hasura Actions

The `sendMessage` mutation is configured as a Hasura Action that calls the n8n webhook:

```yaml
# Action Definition
name: sendMessage
definition:
   kind: synchronous
   handler: https://jolly.app.n8n.cloud/webhook/129279ea-32e4-45f9-932a-40536ef89b95
   forward_client_headers: true
```

### n8n Workflow Configuration

The n8n workflow should:

1. **Receive webhook payload** with `chat_id` and `message`
2. **Process the message** through your AI service
3. **Store the response** in the database
4. **Return the formatted response** to Hasura

Expected webhook response format:
```json
{
   "id": "message-uuid",
   "chat_id": "chat-uuid",
   "content": "AI response content",
   "role": "assistant",
   "created_at": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mouse
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_NHOST_SUBDOMAIN=your-nhost-subdomain
   NEXT_PUBLIC_NHOST_REGION=your-nhost-region
   ```

4. **Set up NHost project**
   - Create a new project at [nhost.io](https://nhost.io)
   - Configure database schema (see above)
   - Set up Row-Level Security policies
   - Configure Hasura actions for AI integration

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

1. **Create an account** using the signup form
2. **Verify your email** (check your inbox for verification link)
3. **Login** and start chatting!

### Testing Authentication

To test the multi-user functionality:
1. Create multiple accounts with different email addresses
2. Login with each account in different browser sessions
3. Verify that each user only sees their own chats and messages

## 🚀 Deployment

### Netlify Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set the build command: `pnpm build`
   - Set the publish directory: `.next`
   - Add environment variables in Netlify dashboard:
     - `NEXT_PUBLIC_NHOST_SUBDOMAIN`
     - `NEXT_PUBLIC_NHOST_REGION`

3. **Configure Next.js for Netlify**
   Install the Netlify adapter:
   ```bash
   pnpm add @netlify/plugin-nextjs
   ```

### Environment Variables for Production

Make sure to add these environment variables in your deployment platform:

```bash
# Required for NHost authentication
NEXT_PUBLIC_NHOST_SUBDOMAIN=your-production-subdomain
NEXT_PUBLIC_NHOST_REGION=your-production-region
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: Required for account activation
- **Row-Level Security**: Database-level access control
- **Environment Variables**: Sensitive data protection
- **HTTPS Enforcement**: Secure data transmission

## 🛠️ Development

### Project Structure

```
mouse/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout with NHost provider
│   ├── page.tsx         # Main chat application
│   └── globals.css      # Global styles
├── components/          # Reusable components
│   ├── providers/       # Context providers
│   ├── chat/           # Chat-specific components
│   └── ui/             # shadcn/ui components
├── lib/                # Utilities and configuration
│   ├── nhost.ts        # NHost client configuration
│   ├── graphql.ts      # GraphQL queries and client
│   ├── constants.ts    # Application constants
│   ├── types.ts        # TypeScript type definitions
│   └── utils/          # Utility functions
└── styles/             # Styling files
```

### Key Components

- **Authentication**: NHost React hooks for auth state management
- **GraphQL Client**: Custom client with JWT token injection
- **Chat Interface**: Real-time messaging with optimistic updates
- **Row-Level Security**: Ensures data isolation between users

## 📱 Usage

1. **Registration**: New users sign up with email and password
2. **Email Verification**: Users must verify their email to access the app
3. **Chat Creation**: Chats are automatically created when sending first message
4. **AI Responses**: Messages are processed through n8n workflows
5. **History**: All chats and messages are persisted per user

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all environment variables are set
2. **Authentication Errors**: Check NHost project configuration
3. **Database Issues**: Verify RLS policies are correctly configured
4. **n8n Integration**: Confirm webhook URLs and authentication

### Debugging Tips

- Check browser console for authentication errors
- Verify NHost dashboard for user registration issues
- Test GraphQL queries in Hasura console
- Ensure environment variables are correctly set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

5. **Open the application**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - Docker container
   - Traditional hosting

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main chat application
├── components/
│   ├── chat/
│   │   ├── message-bubble.tsx    # Individual message component
│   │   └── typing-indicator.tsx  # Loading animation component
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── constants.ts         # Application configuration
│   ├── graphql.ts           # GraphQL queries and client
│   ├── types.ts             # TypeScript type definitions
│   └── utils/
│       ├── chat.ts          # Chat-related utility functions
│       └── markdown.ts      # Markdown parsing utilities
└── README.md
```

## 🔍 Key Components

### Main Application (`app/page.tsx`)
- Handles authentication state
- Manages chat and message state
- Coordinates GraphQL operations
- Renders the main chat interface

### Message Bubble (`components/chat/message-bubble.tsx`)
- Displays individual messages
- Handles markdown formatting
- Shows timestamps and user avatars

### GraphQL Client (`lib/graphql.ts`)
- Centralized GraphQL request handling
- Type-safe query and mutation definitions
- Error handling and authentication headers

### Utility Functions (`lib/utils/`)
- Chat title generation and validation
- Markdown parsing for rich text
- Reusable helper functions

## 🐛 Troubleshooting

### Common Issues

1. **Webhook returning empty responses**
   - Check n8n workflow is active and properly configured
   - Verify webhook URL is correct in Hasura actions
   - Ensure AI service API keys are valid

2. **GraphQL permission errors**
   - Verify Hasura permissions for user role
   - Check authentication headers are correct
   - Ensure database relationships are properly configured

3. **Messages not displaying**
   - Check database schema matches expected structure
   - Verify GraphQL queries return expected data format
   - Check browser console for JavaScript errors

### Debug Mode

Enable debug logging by checking browser console for `[v0]` prefixed messages that show:
- GraphQL request/response details
- Authentication status
- Error information

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Hasura](https://hasura.io/) for the GraphQL engine
- [NHost](https://nhost.io/) for backend services
- [n8n](https://n8n.io/) for workflow automation
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Vercel](https://vercel.com/) for hosting and deployment


---

