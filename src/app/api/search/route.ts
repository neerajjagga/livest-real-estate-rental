import { prisma } from "@/server/db/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        // TODO: later add filter for favoriteIds
        const favoriteIds = searchParams.getAll('favoriteIds');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const beds = searchParams.get('beds');
        const baths = searchParams.get('baths');
        const propertyType = searchParams.get('propertyType');
        const squareFeetMin = searchParams.get('squareFeetMin');
        const squareFeetMax = searchParams.get('squareFeetMax');
        const availableFrom = searchParams.get('availableFrom');
        const latitude = searchParams.get('latitude');
        const longitude = searchParams.get('longitude');
        const amenities = searchParams.get('amenities');  

        const conditions: Prisma.Sql[] = [];

        if (priceMin) {
            conditions.push(Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`);
        }

        if (priceMax) {
            conditions.push(Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`);
        }

        if (beds) {
            conditions.push(Prisma.sql`p.beds = ${Number(beds)}`);
        }

        if (baths) {
            conditions.push(Prisma.sql`p.baths = ${Number(baths)}`);
        }

        if (squareFeetMin) {
            conditions.push(Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`);
        }

        if (squareFeetMax) {
            conditions.push(Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`);
        }

        if (propertyType && propertyType !== "any") {
            conditions.push(Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`);
        }

        if (amenities && amenities !== "any") {
            const amenitiesArray = (amenities as string).split(',');
            conditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
        }

        if (availableFrom && availableFrom !== "any") {
            const availableFromDate = typeof availableFrom === "string" ? availableFrom : null;
            if (availableFromDate) {
                const date = new Date(availableFromDate);
                if (!isNaN(date.getTime())) {
                    conditions.push(
                        Prisma.sql`EXISTS (
                            SELECT 1
                            FROM "Lease" AS l
                            WHERE l."propertyId" = p.id
                            AND l."startDate" <= ${date.toISOString()}
                        )`
                    )
                }
            }
        }

        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            const radiusInMeters = 1000;

            conditions.push(
                Prisma.sql`ST_DWithin(
                    l.coordinates,
                    ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
                    ${radiusInMeters}
                )`
            )
        }

        const completeQuery = Prisma.sql`
            SELECT
               p.*,
               json_build_object(
                    'id', l.id,
                    'address', l.address,
                    'city', l.city,
                    'state', l.state,
                    'country', l.country,
                    'postalCode', l."postalCode",
                    'coordinates', json_build_object(
                        'longitude', ST_X(l."coordinates"::geometry),
                        'latitude', ST_Y(l."coordinates"::geometry)
                    )
               ) as location
               FROM property p
               JOIN location l ON p."locationId" = l.id
               ${conditions.length > 0
                ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
                : Prisma.empty
            }
        `;

        const properties = await prisma.$queryRaw(completeQuery);

        return NextResponse.json({
            success: true,
            properties
        });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message });
        } else {
            return NextResponse.json({ success: false, message: "Something went wrong" });
        }
    }
}