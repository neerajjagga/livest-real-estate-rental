import Navbar from "@/components/landing/Navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="py-3">
            <Navbar />
            <main className={`h-full w-full flex flex-col`}>
                {children}
            </main>
        </div>
    );
}