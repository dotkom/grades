import { env } from "@/env"
import * as trpc from "@trpc/client"
import superjson from "superjson"
import type { AppRouter } from "@grades/backend"

export const server = trpc.createTRPCProxyClient<AppRouter>({
  links: [
    trpc.httpLink({
      transformer: superjson,
      url: `${env.BACKEND_HOST}/api/trpc`,
    }),
  ],
})
