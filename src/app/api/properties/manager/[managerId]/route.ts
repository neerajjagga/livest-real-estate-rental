import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { wktToGeoJSON } from "@terraformer/wkt";

export async function GET(_: NextRequest, { params }: { params: Promise<{ managerId: string }> }) {
    const { managerId } = await params;

    try {

        if (!managerId) {
            return NextResponse.json({ success: false, message: "Manager Id is required" }, { status: 400 });
        }

        // validate managerId
        const manager = await prisma.user.findFirst({
            where: {
                id: managerId,
                role: 'Manager'
            }
        });

        if (!manager) {
            return NextResponse.json({ success: false, message: "Manager not found" }, { status: 404 });
        }

        const properties = await prisma.property.findMany({
            where: {
                managerId,
            },
            include: {
                location: {
                    omit: {
                        createdAt: true,
                        updatedAt: true,
                    }
                },
            }
        });

        if (!properties || properties.length === 0) {
            return NextResponse.json({ success: false, message: "Properties not found" }, { status: 404 });
        }

        const propertiesWithFormattedLocation = await Promise.all(
            properties.map(async (property: typeof properties[0]) => {
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