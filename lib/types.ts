export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

export interface Chat {
  id: string
  title: string
  created_at: string
}

export interface AuthData {
  email: string
  userId: string
  name?: string
}

export interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: any
  }>
}
