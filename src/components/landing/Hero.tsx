'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/singlelisting-2.jpg"
                    alt="Hero Image"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

            <div className="container mx-auto px-6 relative z-10 pt-20">
                <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">

                    <div className="space-y-2 md:space-y-6">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white drop-shadow-2xl">
                            Find Your
                            <span className="block text-primary drop-shadow-lg">
                                Dream Home
                            </span>
                        </h1>

                        <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            Discover exceptional properties in prime locations with our curated selection of homes.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-1 shadow-2xl">
                        <div
                        onClick={() => router.push('/search')} 
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 md:p-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white/70 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search location..."
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/60 text-sm sm:text-base min-w-0"
                                />
                            </div>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg text-sm sm:text-base whitespace-nowrap">
                                <Search className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Search</span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 md:pt-6">
                        <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl shadow-lg font-semibold">
                            Browse Properties
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}