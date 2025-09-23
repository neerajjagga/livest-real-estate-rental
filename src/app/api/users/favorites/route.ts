import { auth } from "@/lib/auth/server";
import { prisma } from "@/server/db/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// add property to favorites
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { propertyId } = body;

        if (!propertyId) {
            return NextResponse.json({ success: false, message: "PropertyId is required" }, { status: 400 });
        }

        const property = await prisma.property.findUnique({
            where: {
                id: propertyId
            }
        });

        if (!property) {
            return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                favorites: {
                    where: { id: propertyId },
                    select: { id: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        if (user.favorites.length > 0) {
            return NextResponse.json({
                success: false,
                message: "Property is already in favorites",
            }, { status: 400 });
        }

        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                favorites: {
                    connect: {
                        id: property.id
                    }
                }
            },
        });

        return NextResponse.json({
            success: true,
            message: "Property added to favorites",
        });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error creating property",
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { propertyId } = body;

        if (!propertyId) {
            return NextResponse.json({ success: false, message: "PropertyId is required" }, { status: 400 });
        }

        const property = await prisma.property.findUnique({
            where: {
                id: propertyId
            }
        });

        if (!property) {
            return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                favorites: {
                    where: { id: propertyId },
                    select: { id: true }
                }
            }
        });

        if (!user || user.favorites.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Property is not in favorites",
            }, { status: 400 });
        }

        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                favorites: {
                    disconnect: {
                        id: property.id
                    }
                }
            },
        });

        return NextResponse.json({
            success: true,
            message: "Property removed from favorites",
        });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error remove property from favorites",
        }, { status: 500 });
    }
}