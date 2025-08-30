"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Code, 
  Database, 
  Settings, 
  Sparkles, 
  Globe,
  Github,
  Mail,
  Heart,
  ArrowLeft,
  Linkedin
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const tableOfContents = [
  {
    id: "overview",
    title: "Overview",
    icon: FileText,
  },
  {
    id: "my-development",
    title: "My Development",
    icon: Code,
    subItems: [
      { id: "frontend", title: "Frontend Framework" },
      { id: "ui-styling", title: "UI & Styling" },
      { id: "backend", title: "Backend Services" },
      { id: "state-management", title: "State Management" },
      { id: "animations", title: "Animations" },
      { id: "package-management", title: "Package Management" },
    ]
  },
  {
    id: "my-features",
    title: "My Features",
    icon: Settings,
    subItems: [
      { id: "workflow", title: "Development Workflow" },
      { id: "frontend-features", title: "Frontend Features" },
      { id: "backend-features", title: "Backend Features" },
      { id: "ui-ux", title: "UI/UX Features" },
    ]
  },
]

export default function DocsPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["my-development", "my-features"])
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Image
                  src="/mouse3-nobg.png"
                  alt="MouseAI"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                MouseAI Chatbot Overview
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                MouseAI is an intelligent chatbot application built with modern web technologies. 
                It features a clean, responsive interface with custom mouse character animations 
                and real-time chat capabilities powered by GraphQL and NHost backend services.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4" />
                    <h3 className="font-medium">Tech Stack</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Next.js 15, TypeScript, shadcn/ui, Tailwind CSS
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4" />
                    <h3 className="font-medium">Backend</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    NHost, GraphQL, Hasura, PostgreSQL
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "my-development":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">My Development</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Comprehensive overview of the technical implementation and development process.
            </p>
            
            <div className="grid gap-4">
              {tableOfContents.find(item => item.id === "my-development")?.subItems?.map((subItem) => (
                <div 
                  key={subItem.id}
                  className="p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setActiveSection(subItem.id)}
                >
                  <h3 className="font-semibold mb-2">{subItem.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subItem.id === "frontend" && "Next.js 15 with TypeScript implementation, App Router, and performance optimizations"}
                    {subItem.id === "ui-styling" && "shadcn/ui component library with Tailwind CSS for modern, responsive design"}
                    {subItem.id === "backend" && "NHost backend services with GraphQL API, Hasura engine, and PostgreSQL database"}
                    {subItem.id === "state-management" && "React hooks-based state management with local storage and real-time updates"}
                    {subItem.id === "animations" && "Custom CSS keyframes and React state for mouse character animations"}
                    {subItem.id === "package-management" && "PNPM for efficient package management and dependency resolution"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case "my-features":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">My Features</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Key features and capabilities implemented in the MouseAI chatbot application.
            </p>
            
            <div className="grid gap-4">
              {tableOfContents.find(item => item.id === "my-features")?.subItems?.map((subItem) => (
                <div 
                  key={subItem.id}
                  className="p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setActiveSection(subItem.id)}
                >
                  <h3 className="font-semibold mb-2">{subItem.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subItem.id === "workflow" && "Development tools, hot reload, component library integration, and modern tooling"}
                    {subItem.id === "frontend-features" && "Authentication system, chat management, real-time messaging, and responsive design"}
                    {subItem.id === "backend-features" && "GraphQL API, real-time subscriptions, database operations, and user management"}
                    {subItem.id === "ui-ux" && "Mouse character animations, theme switching, responsive design, and user experience"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case "frontend":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Frontend Framework</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Next.js 15 with TypeScript
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">App Router Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilizing Next.js 15's modern App Router for file-based routing, enabling server-side rendering, 
                    improved performance, and better developer experience with co-located layouts and loading states.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">TypeScript Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Full TypeScript support throughout the application for compile-time type checking, better IDE support, 
                    improved code maintainability, and enhanced developer productivity with intelligent autocomplete.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Image Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Next.js Image component implementation for automatic image optimization, lazy loading, 
                    WebP format conversion, and responsive image serving for better performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "ui-styling":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">UI & Styling</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                shadcn/ui + Tailwind CSS
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Component Library</h3>
                  <p className="text-sm text-muted-foreground">
                    shadcn/ui provides accessible, customizable UI components built on Radix UI primitives. 
                    Components are copied into the codebase for full control and customization.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Tailwind CSS</h3>
                  <p className="text-sm text-muted-foreground">
                    Utility-first CSS framework for rapid UI development with consistent design tokens, 
                    responsive design utilities, and optimized production builds.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Theme System</h3>
                  <p className="text-sm text-muted-foreground">
                    Dark and light mode support with CSS variables for theme switching, consistent color schemes, 
                    and user preference persistence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "backend":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Backend Services</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                NHost Backend Platform
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">GraphQL API</h3>
                  <p className="text-sm text-muted-foreground">
                    Hasura-powered GraphQL endpoint providing type-safe queries, mutations, and subscriptions 
                    for real-time data operations with automatic schema generation.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in authentication system with JWT tokens, user session management, 
                    and secure password handling with email verification.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">PostgreSQL Database</h3>
                  <p className="text-sm text-muted-foreground">
                    Managed PostgreSQL database with automatic backups, migrations, 
                    and optimized queries for chat message storage and user data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "state-management":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">State Management</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                React Hooks & Local Storage
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">React Hooks</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom hooks for chat management, authentication state, and real-time subscriptions 
                    providing clean separation of concerns and reusable logic.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Local Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Persistent storage for user preferences, theme settings, and chat history 
                    with automatic synchronization and error handling.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    GraphQL subscriptions for live chat updates, typing indicators, 
                    and message delivery status with optimistic UI updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "animations":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Animations</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                MouseAI Character System
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">CSS Keyframes</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom CSS animations for the mouse character including running, idle, 
                    and interaction states with smooth transitions and performance optimization.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">React State Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Animation states controlled by React for dynamic character behavior 
                    based on user interactions and application state changes.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Performance Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Hardware-accelerated animations using transform and opacity properties 
                    for smooth 60fps performance across different devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "package-management":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Package Management</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                PNPM Package Manager
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Efficient Installation</h3>
                  <p className="text-sm text-muted-foreground">
                    PNPM's symlink-based approach reduces disk space usage and installation time 
                    by sharing packages across projects while maintaining strict dependency isolation.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Lockfile Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Deterministic dependency resolution with pnpm-lock.yaml ensuring 
                    consistent installations across development and production environments.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Workspace Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in monorepo and workspace support for managing multiple packages 
                    with shared dependencies and cross-package linking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "workflow":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Development Workflow</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Modern Development Tools
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Hot Reload Development</h3>
                  <p className="text-sm text-muted-foreground">
                    Next.js fast refresh for instant feedback during development with state preservation 
                    and automatic component reloading on file changes.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Component Library Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    shadcn/ui CLI for easy component installation and customization with automatic 
                    dependency management and TypeScript definitions.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Build Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated bundle optimization, code splitting, and static asset optimization 
                    for production-ready builds with minimal manual configuration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "frontend-features":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Frontend Features</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                User Interface Features
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Authentication System</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete user authentication with login, signup, and logout functionality 
                    integrated with NHost backend and secure session management.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Chat Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Full CRUD operations for chat conversations including create, delete, 
                    and real-time message updates with optimistic UI feedback.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Responsive Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Mobile-first responsive design with adaptive layouts, touch-friendly interactions, 
                    and cross-device compatibility using Tailwind CSS utilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "backend-features":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Backend Features</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Server-Side Capabilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">GraphQL API</h3>
                  <p className="text-sm text-muted-foreground">
                    Type-safe GraphQL API with automatic schema generation, query optimization, 
                    and real-time subscriptions for live data updates.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Real-time Subscriptions</h3>
                  <p className="text-sm text-muted-foreground">
                    WebSocket-based real-time updates for chat messages, typing indicators, 
                    and user presence with automatic reconnection handling.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Database Operations</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized PostgreSQL operations with automatic indexing, query optimization, 
                    and data relationships for efficient chat message storage and retrieval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "ui-ux":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">UI/UX Features</h1>
            
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                User Experience Design
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Mouse Character Animations</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom animated mouse character with personality, providing visual feedback 
                    and enhancing user engagement throughout the application.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Theme Switching</h3>
                  <p className="text-sm text-muted-foreground">
                    Seamless dark and light mode switching with user preference persistence 
                    and smooth transitions between theme states.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Responsive Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Adaptive interface that works perfectly across desktop, tablet, and mobile devices 
                    with optimized touch interactions and accessibility features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Select a section</h1>
            <p className="text-muted-foreground">
              Choose a section from the sidebar to view its content.
            </p>
          </div>
        )
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="p-4 border-b">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>
        </Link>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-muted/30 border-r min-h-screen">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/mouse3-nobg.png"
                alt="MouseAI"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h2 className="text-xl font-bold">MouseAI Docs</h2>
            </div>
            
            {/* Developer Info */}
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="text-left mb-3">
                <p className="font-medium text-sm">Shreya</p>
                <p className="text-xs text-muted-foreground">Full Stack Developer</p>
              </div>
              <div className="flex justify-start gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  asChild
                >
                  <a 
                    href="https://www.linkedin.com/in/shreya-analyst/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  asChild
                >
                  <a 
                    href="https://shreya-portfolio-virid.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  asChild
                >
                  <a 
                    href="mailto:shreyyaaa369@gmail.com"
                    className="flex items-center justify-center"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation - removed ScrollArea to remove scrollbar */}
          <div className="p-4">
            <div className="space-y-2">
              {tableOfContents.map((item) => (
                <div key={item.id}>
                  <Button
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => {
                      if (item.subItems) {
                        toggleSection(item.id)
                      } else {
                        setActiveSection(item.id)
                      }
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.title}
                    {item.subItems && (
                      expandedSections.includes(item.id) ? (
                        <ChevronDown className="w-3 h-3 ml-auto" />
                      ) : (
                        <ChevronRight className="w-3 h-3 ml-auto" />
                      )
                    )}
                  </Button>
                  
                  {item.subItems && expandedSections.includes(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant={activeSection === subItem.id ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-sm py-2"
                          onClick={() => setActiveSection(subItem.id)}
                        >
                          <ChevronRight className="w-3 h-3 mr-1" />
                          {subItem.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <ScrollArea className="h-[calc(100vh-5rem)]">
            {renderContent()}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}