import SettingsForm from "@/components/dashboard/SettingsForm";

export default function Settings() {
    return (
        <div className="h-full w-full flex justify-center">
            <div className="space-y-6">
                <div className="text-center pt-4">
                    <h1 className="text-2xl font-bold">
                        {/* { session.user.role === "Manager" ? "Manager" : "Tenant" } Settings */}
                        Settings
                    </h1>
                    <p className="text-foreground">Manage your account preferences and other information.</p>
                </div>
                <SettingsForm />
            </div>
        </div>
    );
}