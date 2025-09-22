import type { auth } from "../lib/auth/server";

export type AuthUser = typeof auth.$Infer.Session.user;