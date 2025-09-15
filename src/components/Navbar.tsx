import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="h-full w-full bg-red-300 container">
            <div className="flex items-center justify-between">
                {/* logo */}
                <div className="flex items-center gap-2">
                    <Link href='/'>
                        <Image
                            src='/logo.svg'
                            alt="Livest Logo"
                            width={26}
                            height={26}
                            className="w-6 h-6"
                        />
                    </Link>
                    <h1 className="font-logo text-primary">livest</h1>
                </div>
            </div>
        </div>
    );
}