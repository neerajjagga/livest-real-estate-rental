import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { wktToGeoJSON } from "@terraformer/wkt";

export async function GET(_: NextRequest, { params }: { params: { tenantId: string } }) {
    const { tenantId } = params;

    try {

        if (!tenantId) {
            return NextResponse.json({ success: false, message: "Tenant Id is required" }, { status: 400 });
        }

        const tenant = await prisma.user.findFirst({
            where: {
                id: tenantId,
                role: "Tenant"
            }
        });

        if (!tenant) {
            return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
        }

        const properties = await prisma.property.findMany({
            where: {
                tenants: {
                    some: {
                        id: tenantId
                    }
                }
            },
            include: {
                location: {
                    omit: {
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!properties || properties.length === 0) {
            return NextResponse.json({ success: false, message: "Properties not found" }, { status: 404 });
        }

        const propertiesWithFormattedLocation = await Promise.all(
            properties.map(async (property) => {
                const coordinates: { coordinates: string }[] =
                    await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM location WHERE id = ${property.location.id}`

                const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
                const longitude = geoJSON.coordinates[0];
                const latitude = geoJSON.coordinates[1];

                return {
                    ...property,
                    location: {
                        ...property.location,
                        coordinates: {
                            latitude,
                            longitude
                        }
                    }
                }
            })
        )

        return NextResponse.json({
            success: true,
            properties: propertiesWithFormattedLocation,
            message: 'Properties fetched successfully'
        });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message });
        } else {
            return NextResponse.json({ success: false, message: "Something went wrong" });
        }
    }
}