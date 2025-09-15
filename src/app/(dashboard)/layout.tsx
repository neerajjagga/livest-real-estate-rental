export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-4">
                <div className="font-logo text-xl mb-8">livest</div>
                <nav>
                    <ul className="space-y-2">
                        <li><a href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a></li>
                        <li><a href="/dashboard/properties" className="block p-2 hover:bg-gray-700 rounded">Properties</a></li>
                        <li><a href="/dashboard/bookings" className="block p-2 hover:bg-gray-700 rounded">Bookings</a></li>
                        <li><a href="/dashboard/profile" className="block p-2 hover:bg-gray-700 rounded">Profile</a></li>
                    </ul>
                </nav>
            </aside>
            
            {/* Main content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
