"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

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
            // Fetch user from DB
            const res = await fetch(`${API_URL}/customers?email=${email}&password=${pass}`);
            const users = await res.json();

            if (users.length === 0) {
                // Try fetching from outlets if not found in customers (if outlets are separate users?)
                // Based on db.json, owners are in 'customers'. Outlets are in 'outlets' but they have owner_name.
                // It seems 'customers' array holds ALL users including owners.
                throw new Error("Invalid credentials");
            }

            const loggedInUser = users[0];
            // Normalize Name
            loggedInUser.name = loggedInUser.first_name
                ? `${loggedInUser.first_name} ${loggedInUser.last_name || ""}`.trim()
                : "User";

            setUser(loggedInUser);
            localStorage.setItem("fc_user", JSON.stringify(loggedInUser));
            localStorage.setItem("fc_token", "mock_token_" + Date.now());

            // Redirect
            if (loggedInUser.role === "owner" || loggedInUser.role === "outlet") {
                router.push("/features/Dashboard");
            } else {
                router.push("/features/MenuBrowsing");
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
            // Check if exists
            const checkRes = await fetch(`${API_URL}/customers?email=${data.email}`);
            const existing = await checkRes.json();
            if (existing.length > 0) {
                throw new Error("Email already exists");
            }

            // POST to customers
            const res = await fetch(`${API_URL}/customers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Registration failed");

            const newUser = await res.json();
            // Normalize Name
            newUser.name = newUser.first_name
                ? `${newUser.first_name} ${newUser.last_name || ""}`.trim()
                : "User";

            setUser(newUser);
            localStorage.setItem("fc_user", JSON.stringify(newUser));
            localStorage.setItem("fc_token", "mock_token_" + Date.now());

            if (newUser.role === "owner" || newUser.role === "outlet") {
                router.push("/features/Dashboard");
            } else {
                router.push("/features/MenuBrowsing");
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
        router.push("/features/Login");
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