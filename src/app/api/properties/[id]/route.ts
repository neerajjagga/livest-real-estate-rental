import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { wktToGeoJSON } from "@terraformer/wkt";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const property = await prisma.property.findFirst({
            where: {
                id,
            },
            include: {
                location: {
                    omit: {
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                manager: {
                    omit: {
                        role: true,
                        emailVerified: true,
                        updatedAt: true,
                    },
                },
            }
        });

        if (!property) {
            return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
        }

        const coordinates: { coordinates: string }[] =
            await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM location WHERE id = ${property.location.id}`

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        const propertyWithCoordinates = {
            ...property,
            location: {
                ...property.location,
                coordinates: {
                    latitude,
                    longitude
                }
            }
        }    

        return NextResponse.json({ 
            success: true, 
            property: propertyWithCoordinates,
            message: 'Property fetched successfully' 
        });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message });
        } else {
            return NextResponse.json({ success: false, message: "Something went wrong" });
        }
    }
}