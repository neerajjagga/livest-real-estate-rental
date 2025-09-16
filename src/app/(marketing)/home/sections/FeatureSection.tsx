import Image from "next/image";

export default function FeatureSection() {
    const features = [
        {
            icon: "/landing-icon-wand.png",
            title: "Smart Property Matching",
            description: "Our AI-powered algorithm matches you with properties that align perfectly with your investment goals and preferences."
        },
        {
            icon: "/landing-icon-calendar.png",
            title: "Flexible Scheduling",
            description: "Book property viewings at your convenience with our flexible scheduling system and virtual tour options."
        },
        {
            icon: "/landing-icon-heart.png",
            title: "Curated Selection",
            description: "Every property is hand-picked and thoroughly vetted by our expert team to ensure quality and investment potential."
        }
    ];

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose Our Platform?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We provide comprehensive tools and services to make your real estate investment journey seamless and profitable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="mb-6 flex justify-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8"
                                    />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
