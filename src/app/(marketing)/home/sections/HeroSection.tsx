
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="container mx-auto px-4 pb-20">
                <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-primary to-secondary py-2 px-4 w-fit rounded-full">
                        <span className="">
                            Home / Properties
                        </span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Find your perfect
                            <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                                investment properties
                            </span>
                        </h1>
                    </div>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                        Explore a curated selection of high-value real estate opportunities designed for
                        <span className="font-semibold text-foreground"> financial growth</span> and
                        <span className="font-semibold text-foreground"> long-term stability</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button className="text-base px-12 py-4 h-auto">
                            Explore Properties
                            <ArrowRight />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 w-full max-w-2xl">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-primary">500+</div>
                            <div className="text-sm text-muted-foreground">Properties Listed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-primary">98%</div>
                            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-primary">$2M+</div>
                            <div className="text-sm text-muted-foreground">Properties Sold</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}