export const HASURA_CONFIG = {
  ENDPOINT: "https://bnqvukehntkdxvfennwr.hasura.ap-south-1.nhost.run/v1/graphql",
  ADMIN_SECRET: "q:cQ&ZJjHzX,9M$&;^U4^SL:SrgWjCk*",
  AUTH_TOKEN: "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",
  USER_ID: "ebc66f89-92b2-4ad4-86f6-009f61b437ae",
} as const

export const STORAGE_KEYS = {
  CHAT_AUTH: "chatAuth",
} as const

export const MESSAGE_LIMITS = {
  TITLE_MAX_LENGTH: 50,
  TYPING_ANIMATION_DELAY: 0.1,
  MIN_TITLE_LENGTH: 10,
  SMART_TRUNCATION_RATIO: 0.7,
} as const
