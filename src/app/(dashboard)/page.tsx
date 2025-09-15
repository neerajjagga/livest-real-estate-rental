export default function DashboardPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Properties</h3>
                    <p className="text-3xl font-bold text-blue-600">24</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Active Bookings</h3>
                    <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Monthly Revenue</h3>
                    <p className="text-3xl font-bold text-purple-600">$8,450</p>
                </div>
            </div>
        </div>
    );
}
