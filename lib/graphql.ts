import { nhost } from "./nhost"
import type { GraphQLResponse } from "./types"

/**
 * Makes a GraphQL request to Hasura with proper authentication headers
 */
export const makeGraphQLRequest = async <T = any>(query: string, variables: Record<string, any> = {}): Promise<T> => {
  const token = nhost.auth.getAccessToken()
  
  const response = await fetch(nhost.graphql.getUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const result: GraphQLResponse<T> = await response.json()
  if (result.errors) {
    throw new Error(result.errors[0].message)
  }
  return result.data!
}

// GraphQL Queries and Mutations (using Row-Level Security)
export const QUERIES = {
  GET_CHATS: `
    query GetChats {
      chats(order_by: {created_at: desc}) {
        id
        title
        created_at
        user_id
      }
    }
  `,

  GET_MESSAGES: `
    query GetMessages($chat_id: uuid!) {
      messages(
        where: {chat_id: {_eq: $chat_id}}
        order_by: {created_at: asc}
      ) {
        id
        content
        role
        created_at
        chat_id
      }
    }
  `,
} as const

export const MUTATIONS = {
  CREATE_CHAT: `
    mutation CreateChat($title: String!) {
      insert_chats_one(object: {title: $title}) {
        id
        title
        created_at
        user_id
      }
    }
  `,

  UPDATE_CHAT_TITLE: `
    mutation UpdateChatTitle($id: uuid!, $title: String!) {
      update_chats_by_pk(pk_columns: {id: $id}, _set: {title: $title}) {
        id
        title
      }
    }
  `,

  DELETE_CHAT: `
    mutation DeleteChat($id: uuid!) {
      delete_messages(where: {chat_id: {_eq: $id}}) {
        affected_rows
      }
      delete_chats_by_pk(id: $id) {
        id
      }
    }
  `,

  INSERT_MESSAGE: `
    mutation InsertMessage($chat_id: uuid!, $content: String!, $role: String!) {
      insert_messages_one(object: {chat_id: $chat_id, content: $content, role: $role}) {
        id
        chat_id
        content
        role
        created_at
      }
    }
  `,
} as const
