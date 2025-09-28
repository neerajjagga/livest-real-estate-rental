'use client';

import React, { useEffect, useState } from "react";
import { useUser } from "../UserProvider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { updateUser } from "@/server/actions/user";
import { toast } from "sonner";

interface SettingsFormData {
    name: string;
    email: string;
}

export default function SettingsForm() {
    const { user, refetchUser } = useUser();

    const [formData, setFormData] = useState<SettingsFormData>({ name: "", email: "" });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    if (!user) return <div>Loading user...</div>;

    const isDisabled =
        (formData.name.trim() === user.name && formData.email.trim() === user.email) ||
        isLoading;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let data: any = {};

        if (user.name !== formData.name) data.name = formData.name;
        if (user.email !== formData.email) data.email = formData.email;

        if (Object.keys(data).length === 0) return;

        setIsLoading(true);
        try {
            await updateUser({ userId: user.id, data });
            toast.success('Profile updated successfully');
            refetchUser();
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                    />
                </div>

                {error && (
                    <span className="text-red-500 text-sm">{error}</span>
                )}

                <Button
                    type="submit"
                    className={`w-full h-11 text-sm font-medium ${isDisabled ? "bg-gray-500" : ""}`}
                    disabled={isDisabled}
                >
                    {isLoading ? "Updating..." : "Update"}
                </Button>
            </form>
        </div>
    );
}