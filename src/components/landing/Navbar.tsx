'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { useUser } from "../UserProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Search } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
    const router = useRouter();
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#27262b] px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <Link href='/' className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={34}
                            height={34}
                            className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[34px] md:h-[34px]"
                        />
                        <h1 className="font-logo text-white text-xl sm:text-2xl md:text-3xl">livest</h1>
                    </Link>

                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-white/90 hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9"
                            onClick={() => router.push('/search')}
                        >
                            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <Skeleton className="h-8 w-16 sm:h-9 sm:w-20 bg-gray-700/30" />
                        <Skeleton className="h-8 w-16 sm:h-9 sm:w-20 bg-gray-700/30" />
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#27262b] px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link href='/' className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={34}
                        height={34}
                        className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[34px] md:h-[34px]"
                    />
                    <h1 className="font-logo text-white text-xl sm:text-2xl md:text-3xl">livest</h1>
                </Link>

                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-white/90 hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => router.push('/search')}
                    >
                        <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    {!user ? (
                        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                            <Button
                                variant='outline'
                                size="sm"
                                className="shadow-lg text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                                onClick={() => router.push('/signin')}
                            >
                                <span className="hidden xs:inline">Log in</span>
                                <span className="xs:hidden">Login</span>
                            </Button>

                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 shadow-lg text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                                onClick={() => router.push('/signup')}
                            >
                                <span className="hidden xs:inline">Join now</span>
                                <span className="xs:hidden">Join</span>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:flex items-center gap-3 lg:gap-5">
                                <ProfileDropdown />
                                {user.role === 'Manager' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:text-white/90 hover:bg-white/10 text-sm"
                                        onClick={() => router.push('/managers/properties')}
                                    >
                                        My Properties
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 lg:h-9"
                                    onClick={async () => {
                                        await signOut();
                                        router.push('/signin');
                                    }}
                                >
                                    <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
                                    <span className="hidden lg:inline ml-1">Sign out</span>
                                </Button>
                            </div>

                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-white hover:text-white/90 hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9"
                                        >
                                            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="bg-zinc-900/95 border-zinc-800 w-[280px] sm:w-[320px]">
                                        <div className="flex flex-col gap-6 mt-6">
                                            <div className="flex items-center gap-3 px-2">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/50 flex items-center justify-center">
                                                    <span className="text-white font-medium text-lg sm:text-xl">
                                                        {user.name?.[0]?.toUpperCase() || "U"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-white font-medium text-sm sm:text-base truncate">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-zinc-400 text-xs sm:text-sm truncate">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10 h-10 sm:h-11 text-sm sm:text-base"
                                                    onClick={() => router.push('/search')}
                                                >
                                                    <Search className="w-4 h-4 mr-3" />
                                                    Search Properties
                                                </Button>
                                                
                                                <div className="border-t border-zinc-700 my-2"></div>

                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10 h-10 sm:h-11 text-sm sm:text-base"
                                                    onClick={() => router.push('/settings')}
                                                >
                                                    Profile
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10 h-10 sm:h-11 text-sm sm:text-base"
                                                    onClick={() => router.push('/settings')}
                                                >
                                                    Settings
                                                </Button>

                                                <div className="border-t border-zinc-700 my-2"></div>

                                                {user.role === 'Tenant' ? (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10 h-10 sm:h-11 text-sm sm:text-base"
                                                            onClick={() => router.push('/tenants/applications')}
                                                        >
                                                            Applications
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10 h-10 sm:h-11 text-sm sm:text-base"
                                                            onClick={() => router.push('/tenants/residences')}
                                                        >
                                                            Residences
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10 h-10 sm:h-11 text-sm sm:text-base"
                                                        onClick={() => router.push('/managers/properties')}
                                                    >
                                                        My Properties
                                                    </Button>
                                                )}

                                                <div className="border-t border-zinc-700 my-2"></div>

                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10 sm:h-11 text-sm sm:text-base"
                                                    onClick={async () => {
                                                        await signOut();
                                                        router.push('/signin');
                                                    }}
                                                >
                                                    <LogOut className="w-4 h-4 mr-3" />
                                                    Sign out
                                                </Button>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}