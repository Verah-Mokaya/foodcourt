"use client";

import { SessionProvider } from "next-auth/react";

export function AuthContextWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
