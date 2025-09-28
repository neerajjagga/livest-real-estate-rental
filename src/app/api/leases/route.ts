import { auth } from "@/lib/auth/server";
import { prisma } from "@/server/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// get leases
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let whereClause: any = {};
        const { user } = session;

        if (user.role === "Tenant") {
            whereClause = {
                tenantId: user.id
            }
        } else if (user.role === "Manager") {
            whereClause = {
                property: {
                    managerId: user.id
                }
            }
        }

        const leases = await prisma.lease.findMany({
            where: whereClause,
            include: {
                tenant: true,
                property: {
                    include: {
                        location: true,
                        manager: true
                    }
                },
                payments: {
                    orderBy: {
                        dueDate: 'desc'
                    }
                },
                application: true
            },
            orderBy: {
                startDate: 'desc'
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