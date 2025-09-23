import { auth } from "@/lib/auth/server";
import { prisma } from "@/server/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


// get leases
export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const leases = await prisma.lease.findMany({
            include: {
                tenant: true,
                property: true
            }
        });

        return NextResponse.json({ success: true, leases });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error getting leases",
        }, { status: 500 });
    }
}