import { auth } from "@/lib/auth/server";
import { prisma } from "@/server/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// get lease payments
export async function GET(_: NextRequest, { params }: { params: { leaseId: string } }) {
    try {
        const { leaseId } = params;
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payments = await prisma.payment.findMany({
            where: {
                leaseId,
            }
        });

        return NextResponse.json({ success: true, payments });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error getting leases",
        }, { status: 500 });
    }
}