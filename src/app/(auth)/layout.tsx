
export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="min-h-screen w-full flex items-center justify-center">
            {children}
        </section>
    );
}