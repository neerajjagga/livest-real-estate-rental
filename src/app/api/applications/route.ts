import { auth } from "@/lib/auth/server";
import { prisma } from "@/server/db/client";
import { createApplicationSchema } from "@/server/validators/schemas";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// get applications
export async function GET() {
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

        const applications = await prisma.application.findMany({
            where: whereClause,
            include: {
                property: {
                    include: {
                        location: true,
                        manager: true,
                    }
                }
            }
        });

        function calculateNextPaymentDate(startDate: Date): Date {
            const today = new Date();
            const nextPaymentDate = new Date(startDate);
            while (nextPaymentDate <= today) {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            }
            return nextPaymentDate;
        }

        const formattedApplications = await Promise.all(
            applications.map(async (app) => {
                const lease = await prisma.lease.findFirst({
                    where: {
                        tenantId: app.tenantId,
                        propertyId: app.propertyId
                    },
                    orderBy: {
                        startDate: "desc"
                    }
                })
                return {
                    ...app,
                    property: {
                        ...app.property,
                        address: app.property.location.address
                    },
                    manager: app.property.manager,
                    lease: lease ? { ...lease, nextPaymentDate: calculateNextPaymentDate(lease.startDate) } : null
                }
            })
        )

        return NextResponse.json({
            success: true,
            applications: formattedApplications,
        });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error getting applications",
        }, { status: 500 });
    }
}

// create application
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "Tenant") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { user } = session;

        const body = await req.json();
        const {
            applicationDate,
            propertyId,
            name,
            email,
            phoneNumber,
            message
        }: any = body;

        const result = createApplicationSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.issues.map(err => ({
                field: err.path.join(".") || "unknown",
                message: err.message,
            }));

            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { pricePerMonth: true, securityDeposit: true }
        });

        if (!property) {
            return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                tenantId: user.id,
                propertyId: propertyId,
                status: "Pending"
            }
        });

        if (existingApplication) {
            return NextResponse.json({ 
                success: false, 
                message: "You already have a pending application for this property" 
            }, { status: 400 });
        }

        const newApplication = await prisma.application.create({
            data: {
                applicationDate: new Date(applicationDate),
                name,
                email,
                phoneNumber,
                message,
                property: {
                    connect: { id: propertyId }
                },
                tenant: {
                    connect: { id: user.id }
                },
                status: "Pending",
            },
            include: {
                property: {
                    include: {
                        location: true,
                        manager: true,
                    }
                },
                tenant: true,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Application created successfully",
            application: newApplication,
        }, { status: 201 });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error creating application",
        }, { status: 500 });
    }
}