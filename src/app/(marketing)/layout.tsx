import Navbar from "@/components/Navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-accent py-3">
            <Navbar />
            <main className={`h-full w-full flex flex-col`}>
                {children}
            </main>
        </div>
    );
}