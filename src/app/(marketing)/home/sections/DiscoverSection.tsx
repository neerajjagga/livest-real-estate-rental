import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function DiscoverSection() {
    const properties = [
        {
            image: "/landing-i1.png",
            title: "Modern Downtown Loft",
            location: "Manhattan, NY",
            price: "$2,450,000",
            type: "Luxury Apartment"
        },
        {
            image: "/landing-i2.png",
            title: "Waterfront Villa",
            location: "Miami Beach, FL",
            price: "$3,200,000",
            type: "Beachfront Property"
        },
        {
            image: "/landing-i3.png",
            title: "Historic Brownstone",
            location: "Brooklyn, NY",
            price: "$1,850,000",
            type: "Historic Home"
        },
        {
            image: "/landing-i4.png",
            title: "Contemporary Penthouse",
            location: "Los Angeles, CA",
            price: "$4,100,000",
            type: "Penthouse Suite"
        },
        {
            image: "/landing-i5.png",
            title: "Garden Estate",
            location: "Hamptons, NY",
            price: "$5,750,000",
            type: "Estate Property"
        },
        {
            image: "/landing-i6.png",
            title: "Urban Townhouse",
            location: "San Francisco, CA",
            price: "$2,900,000",
            type: "Townhouse"
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing-discover-bg.jpg"
                    alt="Discover Background"
                    fill
                    className="object-cover opacity-5"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Discover Premium Properties
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore our handpicked collection of exceptional real estate opportunities across prime locations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {properties.map((property, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-lg mb-4">
                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    width={400}
                                    height={300}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                        {property.type}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                    {property.title}
                                </h3>
                                <p className="text-muted-foreground">{property.location}</p>
                                <p className="text-2xl font-bold text-primary">{property.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button size="lg" className="px-8">
                        View All Properties
                    </Button>
                </div>
            </div>
        </section>
    );
}
