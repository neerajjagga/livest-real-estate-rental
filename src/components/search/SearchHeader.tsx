'use client';

import { Search, Menu, LogOut } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileDropdown from "../landing/ProfileDropdown";

interface SearchHeaderProps {
  onMenuToggle?: () => void;
}

export default function SearchHeader({ onMenuToggle }: SearchHeaderProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href='/' className="flex items-center gap-2 md:gap-3">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={34}
                height={34}
                className="w-[26px] h-[26px] md:w-[34px] md:h-[34px]"
              />
              <h1 className="font-logo text-black text-2xl md:text-3xl">livest</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Discover your perfect rental apartment with our advanced search"
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 bg-gray-200" />
            <Skeleton className="h-9 w-20 bg-gray-200" />
          </div>
        </div>

        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search apartments..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href='/' className="flex items-center gap-2 md:gap-3">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={34}
              height={34}
              className="w-[26px] h-[26px] md:w-[34px] md:h-[34px]"
            />
            <h1 className="font-logo text-black text-2xl md:text-3xl">livest</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Discover your perfect rental apartment with our advanced search"
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

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
                    className="text-black hover:text-black/90 hover:bg-gray-100"
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
                    <Button variant="ghost" size="icon" className="text-black hover:text-black/90 hover:bg-gray-100">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-white border-gray-200">
                    <div className="flex flex-col gap-6 mt-6">
                      <div className="flex items-center gap-3 px-2">
                        <div className="h-10 w-10 rounded-full bg-primary/50 flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {session.user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-black font-medium">
                            {session.user.name}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {session.user.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:text-black/90 hover:bg-gray-100"
                          onClick={() => router.push('/dashboard')}
                        >
                          Dashboard
                        </Button>

                        {session.user.role === 'Manager' && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-black hover:text-black/90 hover:bg-gray-100"
                            onClick={() => router.push('/dashboard/listings')}
                          >
                            My Listings
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:text-black/90 hover:bg-gray-100"
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

      <div className="md:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search apartments..."
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>
    </header>
  );
}
