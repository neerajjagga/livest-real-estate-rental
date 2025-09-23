import { auth } from "@/lib/auth/server";
import { prisma } from "@/server/db/client";
import { applicationSchema, updateApplicationSchema } from "@/server/validators/schemas";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function PATCH(req: NextRequest, { params }: { params: { applicationId: string } }) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "Manager") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const result = updateApplicationSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.issues.map(err => ({
                field: err.path.join(".") || "unknown",
                message: err.message,
            }));

            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        const { status } = body;
        const { applicationId } = params;
        const { user } = session;

        if (!status) {
            return NextResponse.json({ success: false, message: "Status is required to update the application" }, { status: 400 });
        }

        if(status === "Pending") {
            return NextResponse.json({ success: false, message: "Status can't be pending" }, { status: 400 });
        }

        const application = await prisma.application.findUnique({
            where: {
                id: applicationId
            },
            include: {
                property: {
                    select: {
                        id: true,
                        managerId: true,
                        pricePerMonth: true,
                        securityDeposit: true,
                    }
                }
            }
        });

        if (!application) {
            return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
        }

        if (application && application.property.managerId !== user.id) {
            return NextResponse.json({ success: false, message: "You are not the manager of this property" }, { status: 403 });
        }

        if (status === "Approved") {
            // create new lease
            const newLease = await prisma.lease.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                    ),
                    rent: application.property.pricePerMonth,
                    deposit: application.property.securityDeposit,
                    propertyId: application.propertyId,
                    tenantId: application.tenantId,
                },
            });

            // update the property to connect to tenant
            await prisma.property.update({
                where: { id: application.property.id },
                data: {
                    tenants: {
                        connect: { id: application.tenantId }
                    }
                }
            })

            // update the application with new leaseId
            await prisma.application.update({
                where: { id: applicationId },
                data: {
                    status,
                    leaseId: newLease.id
                },
                include: {
                    property: true,
                    tenant: true,
                    lease: true,
                }
            })
        } else {
            // set to rejected
            await prisma.application.update({
                where: { id: applicationId },
                data: {
                    status
                }
            });
        }

        // updated application
        const updatedApplication = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                property: true,
                tenant: true,
                lease: true,
            }
        });

        return NextResponse.json({
            success: true,
            application: updatedApplication,
            message : "Application updated successfully"
        });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error updating application",
        }, { status: 500 });
    }
}