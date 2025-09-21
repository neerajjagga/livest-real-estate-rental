import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import { prisma } from "@/server/db/client";
import { Location } from "@prisma/client";
import { propertySchema } from "@/server/validators/schemas";
import { v4 as uuidv4 } from 'uuid'

 /**
 * TODO:
 * - validate managerId and validate the presence of manager user  
 * - Add more data validations to this api
 * - populate data properly when sending back to client after creating property
 *      - add coordinates in location
 *      - omit relevant fields from location, manager, property as well 
 */

// create property
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = propertySchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.issues.map(err => ({
                field: err.path.join(".") || "unknown",
                message: err.message,
            }));

            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        const {
            address,
            city,
            state,
            country,
            postalCode,
            managerId,
            photoUrls,
            ...propertyData
        }:any = result.data;

        const geoCodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
            street: address,
            city,
            country,
            postalcode: postalCode,
            format: "json",
            limit: "1"
        }).toString()}`;

        const geoCodingResponse = await axios.get(geoCodingUrl, {
            headers: {
                "User-Agent": "livest (neerajsm001@gmail.com)"
            }
        });

        const [longitude, latitude] = geoCodingResponse.data[0]?.lon && geoCodingResponse.data[0]?.lat
            ? [
                parseFloat(geoCodingResponse.data[0].lon),
                parseFloat(geoCodingResponse.data[0].lat)
            ] : [0, 0]

        const now = new Date();
        // create location
        const [location] = await prisma.$queryRaw<Location[]>`
            INSERT INTO location (id, address, city, state, country, "postalCode", coordinates, "updatedAt")
            VALUES (${uuidv4()}, ${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${now})
            RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates
        `

        // create property
        const newProperty = await prisma.property.create({
            data: {
                ...propertyData,
                photoUrls,
                locationId: location.id,
                managerId,
                amenities:
                    typeof propertyData.amenities === "string"
                        ? propertyData.amenities.split(',')
                        : [],
                highlights:
                    typeof propertyData.highlights === "string"
                        ? propertyData.highlights.split(',')
                        : [],
                isPetsAllowed: propertyData.isPetsAllowed === "true",
                isParkingIncluded: propertyData.isParkingIncluded === "true",
                pricePerMonth: parseFloat(propertyData.pricePerMonth),
                securityDeposit: parseFloat(propertyData.securityDeposit),
                applicationFee: parseFloat(propertyData.applicationFee),
                beds: parseInt(propertyData.beds),
                baths: parseInt(propertyData.baths),
                squareFeet: parseInt(propertyData.squareFeet),
            },
            include: {
                location: true,
                manager: true,
            }
        });

        return NextResponse.json({
            success: true,
            property: newProperty,
            message: "Property created successfully",
        });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message || "Error creating property",
        }, { status: 500 });
    }
}