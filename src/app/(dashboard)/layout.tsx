import AppSidebar from "@/components/dashboard/AppSidebar";
import Navbar from "@/components/landing/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-primary-100">
                <Navbar />
                <div className="pt-20 w-full">
                    <main className="flex">
                        <AppSidebar userType="Tenant" />
                        <div className="flex flex-grow transition-all duration-300">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}