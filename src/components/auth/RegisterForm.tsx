'use client'

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { signIn, signUp } from "@/lib/auth/client";
import { UserRole } from "@prisma/client";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole
}

export default function RegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterFormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: 'Tenant'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (formData.password.trim() !== formData.confirmPassword.trim()) {
            setError("Passwords do not match");
            return;
        }

        await signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: formData.role,
        }, {
            onRequest: () => {
                setIsLoading(true);
            },
            onResponse: () => {
                setIsLoading(false);
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            },
            onSuccess: (res) => {
                toast.success("Account created successfully");
                router.push("/dashboard");
            },
        });
    };

    const handleGoogleSignup = async () => {
        await signIn.social({ provider: 'google' });
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your information to create your account
                </p>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-sm font-medium"
                onClick={handleGoogleSignup}
            >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Password
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Confirm password
                    </label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Role
                    </label>
                    <RadioGroup
                        className="mt-2" 
                        onValueChange={(val) => {
                        setFormData(prev => ({
                            ...prev,
                            role: val as UserRole
                        }));
                    }}
                        defaultValue="Tenant">
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="Tenant" id="tenant" />
                            <Label htmlFor="tenant">Tenant</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="Manager" id="manager" />
                            <Label htmlFor="manager">Manager</Label>
                        </div>
                    </RadioGroup>
                </div>

                {error && (
                    <span className="text-red-500 text-sm">{error}</span>
                )}

                <Button
                    type="submit"
                    className="w-full h-11 text-sm font-medium"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                    onClick={() => router.push('/signin')}
                >
                    Sign in
                </button>
            </div>
        </div>
    );
}