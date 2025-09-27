import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            prompt: 'select_account',
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => {
                return {
                    email: profile.email,
                    name: profile.name,
                    image: profile.picture,
                }
            }
        }
    },
    user: {
        additionalFields: {
            role: {
                type: ['Tenant', 'Manager'],
                input: true,
                defaultValue: "Tenant",
            },
        },
        select: {
            id: true,
            email: true,
            image: true,
            role: true
        }
    },
    advanced: {
        cookiePrefix: "livest",
        defaultCookieAttributes: {
            httpOnly: true,
            secure: true,
        },
    },
});