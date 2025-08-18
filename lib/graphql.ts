import { HASURA_CONFIG } from "./constants"
import type { GraphQLResponse } from "./types"

/**
 * Makes a GraphQL request to Hasura with proper authentication headers
 */
export const makeGraphQLRequest = async <T = any>(query: string, variables: Record<string, any> = {}): Promise<T> => {
  const response = await fetch(HASURA_CONFIG.ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": HASURA_CONFIG.ADMIN_SECRET,
      authorization: `Bearer ${HASURA_CONFIG.AUTH_TOKEN}`,
      "X-Hasura-User-Id": HASURA_CONFIG.USER_ID,
      "X-Hasura-Role": "user",
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

// GraphQL Queries and Mutations
export const QUERIES = {
  GET_CHATS: `
    query GetChats {
      chats(order_by: {created_at: desc}) {
        id
        title
        created_at
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
} as const
