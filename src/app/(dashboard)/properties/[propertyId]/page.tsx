import PropertyDetailsLayout from "@/components/properties/PropertyDetailsLayout";

export async function generateMetadata({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${propertyId}`);

    const { property } = await res.json();

    if (!res.ok) {
        return {
            title: "Property Not Found | LivestRental",
            description: "The requested property could not be found.",
        };
    }

    return {
        title: `${property.name} - $${property.pricePerMonth}/month | LivestRental`,
        description: `${property.description?.slice(0, 160) || `${property.beds} bed, ${property.baths} bath ${property.propertyType?.toLowerCase()} in ${property.location?.city}, ${property.location?.state}. Available for $${property.pricePerMonth}/month.`}`,
        keywords: [
            "rental property",
            "apartment",
            "house",
            property.propertyType?.toLowerCase(),
            property.location?.city,
            property.location?.state,
            `${property.beds} bedroom`,
            `${property.baths} bathroom`,
            "real estate",
            "property rental",
        ].filter(Boolean),
        openGraph: {
            title: `${property.name} - $${property.pricePerMonth}/month`,
            description: property.description?.slice(0, 200) || `${property.beds} bed, ${property.baths} bath ${property.propertyType?.toLowerCase()} in ${property.location?.city}, ${property.location?.state}. Available for $${property.pricePerMonth}/month. ${property.squareFeet} sq ft.`,
            type: "website",
            images: property.photoUrls && property.photoUrls.length > 0 ? [
                {
                    url: property.photoUrls[0],
                    width: 1200,
                    height: 630,
                    alt: `${property.name} - Property Image`,
                }
            ] : [],
            locale: "en_US",
            siteName: "Livest",
        }
    }
}

export default async function Property({ params }: { params: Promise<{ propertyId: string }> }) {
    const { propertyId } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${propertyId}`);

    if (!res.ok) {
        throw new Error("Failed to fetch property");
    }

    const { property } = await res.json();

    return (
        <div className="flex justify-center h-full w-full">
            <PropertyDetailsLayout
                property={property}
            />
        </div>
    );
}