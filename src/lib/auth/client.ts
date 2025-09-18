import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./server";

const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    plugins: [ inferAdditionalFields<typeof auth>() ],
});

export const { signIn, signUp, signOut, useSession } = authClient;