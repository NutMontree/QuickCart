import { serve } from "inngest/next";
import { inngest, syncUserCreateion, syncUserUpdateion, syncDeletion } from "@/config/inngest"

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreateion,
    syncUserUpdateion,
    syncDeletion
  ],
});
