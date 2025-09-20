'use server'

import { prisma } from "../db/client"

interface UpdateUserParams {
    userId: string;
    data: {
        name ?: string;
        email ?: string;
    }
}

export async function updateUser(params: UpdateUserParams) {
    return prisma.user.update({
        where: {
            id: params.userId
        },
        data: { ...params.data }
    });
}