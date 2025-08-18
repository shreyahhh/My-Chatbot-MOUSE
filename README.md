
# mouse: Hasura GraphQL Chat Application

A modern, real-time chat application built with Next.js, Hasura GraphQL, and n8n automation workflows. This application demonstrates a complete full-stack implementation with authentication, real-time messaging, and AI-powered responses.


## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│  Hasura GraphQL │───▶│   n8n Webhook   │───▶│   AI Service    │
│   (Frontend)    │    │   (Backend)     │    │  (Automation)   │    │  (OpenAI/etc)   │
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
- **Real-time Chat Interface**: Modern, responsive chat UI with message bubbles
- **Auto-naming Chats**: Automatically names chats based on the first message
- **Message History**: Persistent chat history with PostgreSQL storage
- **Authentication System**: Simple email/password authentication with local storage
- **Markdown Support**: Rich text formatting with **bold** and *italic* support
- **Typing Indicators**: Visual feedback during message processing
- **Error Handling**: Comprehensive error handling with user-friendly messages

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

### Backend Services
- **Hasura GraphQL Engine**: Real-time GraphQL API
- **NHost**: Backend-as-a-Service platform
- **PostgreSQL**: Relational database
- **n8n**: Workflow automation platform

### AI Integration
- **OpenAI API**: AI-powered chat responses
- **Custom Webhooks**: Integration layer between Hasura and AI services

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js 18+ installed
- Access to the configured services:
  - NHost project with PostgreSQL database
  - Hasura GraphQL Engine instance
  - n8n workflow automation setup
  - AI service API keys (OpenAI, etc.)

## 🔧 Configuration

### Environment Variables

The application uses the following configuration (currently hardcoded in `lib/constants.ts`):

```typescript
export const HASURA_CONFIG = {
   ENDPOINT: "https://bnqvukehntkdxvfennwr.hasura.ap-south-1.nhost.run/v1/graphql",
   ADMIN_SECRET: "your-hasura-admin-secret",
   AUTH_TOKEN: "your-auth-token",
   USER_ID: "your-user-id",
}
```

### Database Schema

The application requires the following PostgreSQL tables:

#### `chats` table
```sql
CREATE TABLE chats (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID REFERENCES users(id),
   title TEXT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Primary Key: chats_pkey (id)
-- Foreign Key: user_id → users.id (chats_user_id_fkey)
-- You may add a unique key or additional indexes as needed
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
   npm install
   ```

3. **Configure the application**
   - Update `lib/constants.ts` with your service endpoints
   - Ensure your database schema is set up
   - Configure Hasura actions and permissions

4. **Run the development server**
   ```bash
   npm run dev
   ```

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

