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
        title: `${property.title} - $${property.pricePerMonth}/month | LivestRental`,
        description: `${property.description?.slice(0, 160) || `${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.location?.city}, ${property.location?.state}. Available for $${property.pricePerMonth}/month.`}`,
        keywords: [
            "rental property",
            "apartment",
            "house",
            property.propertyType?.toLowerCase(),
            property.location?.city,
            property.location?.state,
            `${property.bedrooms} bedroom`,
            `${property.bathrooms} bathroom`,
            "real estate",
            "property rental"
        ].filter(Boolean),
        openGraph: {
            title: `${property.title} - $${property.pricePerMonth}/month`,
            description: property.description?.slice(0, 200) || `${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.location?.city}, ${property.location?.state}. Available for $${property.pricePerMonth}/month.`,
            type: "website",
            images: property.photos && property.photos.length > 0 ? [
                {
                    url: property.photos[0],
                    width: 1200,
                    height: 630,
                    alt: `${property.title} - Property Image`,
                }
            ] : [],
            locale: "en_US",
            siteName: "LivestRental",
        },
        twitter: {
            card: "summary_large_image",
            title: `${property.title} - $${property.pricePerMonth}/month`,
            description: property.description?.slice(0, 200) || `${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.location?.city}, ${property.location?.state}. Available for $${property.pricePerMonth}/month.`,
            images: property.photos && property.photos.length > 0 ? [property.photos[0]] : [],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/${propertyId}`,
        },
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