'use client';

import { useUser } from "@/components/UserProvider";

export default function Favorites() {
    const { user } = useUser();
    console.log("User from context", user);
    
    return (
        <div>Favorites</div>
    );
}