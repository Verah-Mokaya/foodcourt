"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/app/lib/types";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/lib/api";
import { ROUTES } from "@/app/lib/routes";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // --- Check auth on initial load ---
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    credentials: "include", // <- send cookies automatically
                });
                if (res.ok) {
                    const { user: identity } = await res.json();
                    setUser({
                        id: identity.id,
                        email: identity.email || "",
                        role: identity.role,
                        name: identity.name || (identity.role === "customer" ? "Customer" : "Outlet"),
                        outletId: (identity.role === "outlet" || identity.role === "owner") ? identity.id : undefined
                    });
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error("Auth check failed", e);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    // --- Login ---
    const login = async (email: string, pass: string) => {
        setIsLoading(true);
        try {
            // Try customer login first
            let res = await fetch(`${API_URL}/auth/customer/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass }),
                credentials: "include", // <- cookie-based login
            });

            if (!res.ok) {
                // Try outlet login
                res = await fetch(`${API_URL}/auth/outlet/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password: pass }),
                    credentials: "include",
                });
            }

            if (!res.ok) throw new Error("Invalid credentials");

            // Fetch /me for user details
            const meRes = await fetch(`${API_URL}/auth/me`, {
                credentials: "include", // <- get user from cookie
            });

            if (!meRes.ok) throw new Error("Failed to fetch user details");

            const { user: identity } = await meRes.json();

            const loggedInUser: User = {
                id: identity.id,
                email: identity.email || email,
                role: identity.role,
                name: identity.name || (identity.role === "customer" ? "Customer" : "Outlet Owner"),
                outletId: (identity.role === "outlet" || identity.role === "owner") ? identity.id : undefined
            };

            setUser(loggedInUser);

            // Redirect
            if (loggedInUser.role === "owner" || loggedInUser.role === "outlet") {
                router.push(ROUTES.DASHBOARD);
            } else {
                router.push(ROUTES.MARKETPLACE);
            }

        } catch (error) {
            console.error("Login Error", error);
            alert("Login failed: Invalid credentials or server error");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Register ---
    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const endpoint = data.role === "customer"
                ? "/auth/customer/register"
                : "/auth/outlet/register";

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include", // <- cookie login on register
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Registration failed");
            }

            // Fetch /me for user details
            const meRes = await fetch(`${API_URL}/auth/me`, {
                credentials: "include",
            });

            if (!meRes.ok) throw new Error("Failed to fetch user info");

            const { user: identity } = await meRes.json();

            const newUser: User = {
                id: identity.id,
                email: identity.email || data.email,
                role: identity.role,
                name: data.first_name ? `${data.first_name} ${data.last_name || ""}`.trim() : "User",
                outletId: (identity.role === "outlet" || identity.role === "owner") ? identity.id : undefined
            };

            setUser(newUser);

            // Redirect
            if (newUser.role === "owner" || newUser.role === "outlet") {
                router.push(ROUTES.DASHBOARD);
            } else {
                router.push(ROUTES.MARKETPLACE);
            }

        } catch (error: any) {
            console.error("Registration Error", error);
            alert(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Logout ---
    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include", // <- clear cookie on backend
            });
        } catch (err) {
            console.error("Logout Error", err);
        } finally {
            setUser(null);
            router.push(ROUTES.LOGIN);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}