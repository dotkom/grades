"use client"

import { createTRPCContext } from "@trpc/tanstack-react-query"
import type { AppRouter } from "@grades/backend"

// React query trpc
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()
