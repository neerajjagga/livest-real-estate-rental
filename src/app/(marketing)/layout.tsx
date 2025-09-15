import Navbar from "@/components/Navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <main className={`h-full w-full flex flex-col`}>
                {children}
            </main>
        </div>
    );
}