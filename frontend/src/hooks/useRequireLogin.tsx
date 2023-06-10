"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export function useRequireLogin() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/')
  }, [status, session, router])

  const isLoading = status === 'loading' || status === 'unauthenticated'

  return [isLoading] as const
}