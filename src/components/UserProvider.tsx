'use client';

import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthUser } from "@/types/auth";
import { useSession } from "@/lib/auth/client";

interface UserContextType {
    user: AuthUser | null;
    isLoading: boolean;
    refetchUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { data: session, refetch, isPending } = useSession();
    const [user, setUser] = useState<AuthUser | null>(session?.user || null);

    useEffect(() => {
        setUser(session?.user || null);
    }, [session]);

    return (
        <UserContext.Provider value={{ user, isLoading: isPending, refetchUser: refetch }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
}