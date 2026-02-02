"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import { UtensilsCrossed, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/lib/routes";

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            // Error handling is done in context for now (alert)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 relative">
            <Link href={ROUTES.HOME} className="absolute top-6 left-6 flex items-center gap-2 text-gray-900 hover:text-orange-600 transition-colors">
                <div className="bg-orange-600 p-1.5 rounded-lg rotate-3">
                    <UtensilsCrossed className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold tracking-tight">FoodCourt</span>
            </Link>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                        <UtensilsCrossed className="h-8 w-8 text-orange-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to continue to your account
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            required
                            type="password"
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href={ROUTES.SIGNUP} className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}