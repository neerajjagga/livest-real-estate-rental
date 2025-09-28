import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/server/db/client";

// get properties for the current manager
export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized" 
            }, { status: 401 });
        }

        const { user } = session;

        if (user.role !== "Manager") {
            return NextResponse.json({ 
                success: false, 
                message: "Access denied. Only managers can access this endpoint." 
            }, { status: 403 });
        }

        const properties = await prisma.property.findMany({
            where: {
                managerId: user.id
            },
            include: {
                location: {
                    omit: {
                        id: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                applications: {
                    select: {
                        id: true,
                        status: true,
                        applicationDate: true,
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                leases: {
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        rent: true,
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        applications: true,
                        leases: true,
                        favoritedBy: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            properties,
            message: "Properties retrieved successfully"
        });

    } catch (err: any) {
        console.error("Error fetching manager properties:", err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error fetching properties",
        }, { status: 500 });
    }
}