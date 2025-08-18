'use client'

import { NhostProvider } from '@nhost/react'
import { nhost } from '@/lib/nhost'

export function NHostClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NhostProvider nhost={nhost}>
      {children}
    </NhostProvider>
  )
}
