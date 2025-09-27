'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#27262b] px-4 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <Link href='/' className="flex items-center gap-2 md:gap-3">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={34}
                            height={34}
                            className="w-[26px] h-[26px] md:w-[34px] md:h-[34px]"
                        />
                        <h1 className="font-logo text-white text-2xl md:text-3xl">livest</h1>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-20 bg-gray-700/30" />
                        <Skeleton className="h-9 w-20 bg-gray-700/30" />
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#27262b] px-4 py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link href='/' className="flex items-center gap-2 md:gap-3">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={34}
                        height={34}
                        className="w-[26px] h-[26px] md:w-[34px] md:h-[34px]"
                    />
                    <h1 className="font-logo text-white text-2xl md:text-3xl">livest</h1>
                </Link>

                <div className="flex items-center gap-3">
                    {!session?.user ? (
                        <div className="flex items-center gap-2 md:gap-3">
                            <Button
                                variant='outline'
                                className="shadow-lg"
                                onClick={() => router.push('/signin')}
                            >
                                Log in
                            </Button>

                            <Button
                                className="bg-primary hover:bg-primary/90 shadow-lg"
                                onClick={() => router.push('/signup')}
                            >
                                Join now
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:flex items-center gap-5">
                                <ProfileDropdown />
                                {session.user.role === 'Manager' && (
                                    <Button
                                        variant="ghost"
                                        className="text-white hover:text-white/90 hover:bg-white/10"
                                        onClick={() => router.push('/dashboard/listings')}
                                    >
                                        My Listings
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                        await signOut();
                                        router.push('/signin');
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out
                                </Button>
                            </div>

                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-white hover:text-white/90 hover:bg-white/10">
                                            <Menu className="w-5 h-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="bg-zinc-900/95 border-zinc-800">
                                        <div className="flex flex-col gap-6 mt-6">
                                            <div className="flex items-center gap-3 px-2">
                                                <div className="h-10 w-10 rounded-full bg-primary/50 flex items-center justify-center">
                                                    <span className="text-white font-medium text-lg">
                                                        {session.user.name?.[0]?.toUpperCase() || "U"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">
                                                        {session.user.name}
                                                    </span>
                                                    <span className="text-zinc-400 text-sm">
                                                        {session.user.email}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10"
                                                    onClick={() => router.push('/dashboard')}
                                                >
                                                    Dashboard
                                                </Button>

                                                {session.user.role === 'Manager' && (
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10"
                                                        onClick={() => router.push('/dashboard/listings')}
                                                    >
                                                        My Listings
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-white hover:text-white/90 hover:bg-white/10"
                                                    onClick={async () => {
                                                        await signOut();
                                                        router.push('/signin');
                                                    }}
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
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