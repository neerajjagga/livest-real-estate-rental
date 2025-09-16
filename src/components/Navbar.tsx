import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';

export default function Navbar() {
    return (
        <div className="h-full w-full container py-3 px-4 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
                {/* logo */}
                <div className="flex items-center gap-2">
                    <Link href='/'>
                        {/* <Image
                            src='/logo.svg'
                            alt="Livest Logo"
                            width={26}
                            height={26}
                            className="w-6 h-6"
                        /> */}
                        <h1 className="font-logo text-primary text-2xl">livest</h1>
                    </Link>
                </div>

                <div className="hidden md:block">
                    <ul className="flex items-center gap-8 text-gray-700 text-[16px]">
                        <li className="text-gray-900 font-semibold cursor-pointer">Home</li>
                        <li className="cursor-pointer">Properties</li>
                        <li className="cursor-pointer">About</li>
                        <li className="cursor-pointer">Contact</li>
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant='outline'
                        >
                            Log in
                        </Button>

                        <Button
                            className="bg-black"
                        >
                            Join now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}