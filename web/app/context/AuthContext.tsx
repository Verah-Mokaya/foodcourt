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
    logout: () => void;
    register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("fc_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, pass: string) => {
        setIsLoading(true);
        try {
            // Try customer login first
            let res = await fetch(`${API_URL}/auth/customer/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass })
            });

            if (!res.ok) {
                // Try outlet login
                res = await fetch(`${API_URL}/auth/outlet/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password: pass })
                });
            }

            if (!res.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await res.json();
            const token = data.access_token;

            // Fetch me to get user details
            const meRes = await fetch(`${API_URL}/auth/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!meRes.ok) throw new Error("Failed to fetch user details");

            const { user: identity } = await meRes.json();

            // Construct user object
            const loggedInUser: User = {
                id: identity.id,
                email: email,
                role: identity.role,
                name: identity.role === "customer" ? "Customer" : "Outlet Owner"
            };

            setUser(loggedInUser);
            localStorage.setItem("fc_user", JSON.stringify(loggedInUser));
            localStorage.setItem("fc_token", token);

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

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const endpoint = data.role === "customer"
                ? "/auth/customer/register"
                : "/auth/outlet/register";

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Registration failed");
            }

            const respData = await res.json();
            const token = respData.access_token;

            // Fetch me to get user details
            const meRes = await fetch(`${API_URL}/auth/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const { user: identity } = await meRes.json();

            const newUser: User = {
                id: identity.id,
                email: data.email,
                role: identity.role,
                name: data.first_name ? `${data.first_name} ${data.last_name || ""}`.trim() : "User"
            };

            setUser(newUser);
            localStorage.setItem("fc_user", JSON.stringify(newUser));
            localStorage.setItem("fc_token", token);

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

    const logout = () => {
        setUser(null);
        localStorage.removeItem("fc_token");
        localStorage.removeItem("fc_user");
        router.push(ROUTES.LOGIN);
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