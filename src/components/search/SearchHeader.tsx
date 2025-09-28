'use client';

import { Search, Menu, LogOut } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { useUser } from "../UserProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileDropdown from "../landing/ProfileDropdown";

interface SearchHeaderProps {
  onMenuToggle?: () => void;
}

export default function SearchHeader({ onMenuToggle }: SearchHeaderProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 p-0"
              onClick={onMenuToggle}
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Link href='/' className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={34}
                height={34}
                className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[34px] md:h-[34px]"
              />
              <h1 className="font-logo text-black text-xl sm:text-2xl md:text-3xl">livest</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Discover your perfect rental apartment with our advanced search"
                className="pl-10 pr-4 py-2 w-full text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <Skeleton className="h-8 w-16 sm:h-9 sm:w-20 bg-gray-200" />
            <Skeleton className="h-8 w-16 sm:h-9 sm:w-20 bg-gray-200" />
          </div>
        </div>

        <div className="md:hidden mt-2 sm:mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search apartments..."
              className="pl-10 pr-4 py-2 w-full text-sm"
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 p-0"
            onClick={onMenuToggle}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Link href='/' className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={34}
              height={34}
              className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[34px] md:h-[34px]"
            />
            <h1 className="font-logo text-black text-xl sm:text-2xl md:text-3xl">livest</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Discover your perfect rental apartment with our advanced search"
              className="pl-10 pr-4 py-2 w-full text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
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
                    className="text-black hover:text-black/90 hover:bg-gray-100 text-sm"
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
                      className="text-black hover:text-black/90 hover:bg-gray-100 h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-white border-gray-200 w-[280px] sm:w-[320px]">
                    <div className="flex flex-col gap-6 mt-6">
                      <div className="flex items-center gap-3 px-2">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/50 flex items-center justify-center">
                          <span className="text-white font-medium text-lg sm:text-xl">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-black font-medium text-sm sm:text-base truncate">
                            {user.name}
                          </span>
                          <span className="text-gray-600 text-xs sm:text-sm truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:text-black/90 hover:bg-gray-100 h-10 sm:h-11 text-sm sm:text-base"
                          onClick={() => router.push('/dashboard')}
                        >
                          Dashboard
                        </Button>

                        {user.role === 'Manager' && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-black hover:text-black/90 hover:bg-gray-100 h-10 sm:h-11 text-sm sm:text-base"
                            onClick={() => router.push('/managers/properties')}
                          >
                            My Properties
                          </Button>
                        )}

                        <div className="border-t border-gray-200 my-2"></div>

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-10 sm:h-11 text-sm sm:text-base"
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

      <div className="md:hidden mt-2 sm:mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search apartments..."
            className="pl-10 pr-4 py-2 w-full text-sm"
          />
        </div>
      </div>
    </header>
  );
}
