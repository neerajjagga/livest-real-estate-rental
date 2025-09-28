import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <Link href="/search">
            <Button
                size="lg"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-primary hover:bg-primary/80"
                aria-label="Search Properties"
            >
                <Search className="h-12 w-12" />
            </Button>
        </Link>
    );
}