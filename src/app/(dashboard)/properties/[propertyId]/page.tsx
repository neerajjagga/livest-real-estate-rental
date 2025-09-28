import PropertyDetailsLayout from "@/components/properties/PropertyDetailsLayout";

export default async function Property({ params }: { params: { propertyId: string } }) {
    const { propertyId } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${propertyId}`, {
        cache: "no-store",
    });

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