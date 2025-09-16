import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function CallToActionSection() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing-call-to-action.jpg"
                    alt="Call to Action Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to Find Your Perfect Investment?
                    </h2>
                    <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                        Join thousands of successful investors who trust our platform to discover
                        premium real estate opportunities. Start your journey today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 py-4 h-auto">
                            Get Started Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
