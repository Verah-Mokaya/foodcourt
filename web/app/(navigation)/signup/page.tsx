"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Store, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { ROUTES } from "@/app/lib/routes";


export default function SignupPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [role, setRole] = useState<"customer" | "outlet">("customer");
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        outletName: "",
        cuisine: ""
    });

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const [firstName, ...lastNameParts] = formData.name.split(" ");
            const lastName = lastNameParts.join(" ") || "";

            
            let payload: any = {
                email: formData.email,
                password: formData.password,
                role: role === "outlet" ? "owner" : "customer", 
                first_name: firstName,
                last_name: lastName,
                phone_number: "0725123456"
            };

            if (role === "outlet") {
                payload = {
                    ...payload,
                    outlet_name: formData.outletName,
                    owner_name: formData.name,
                    cuisine_type: formData.cuisine,
                    description: `Welcome to ${formData.outletName}`
                };
            }


            await register(payload);

        } catch (error: any) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 relative">
            <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-900 hover:text-orange-600 transition-colors">
                <div className="bg-orange-600 p-1.5 rounded-lg rotate-3">
                    <Store className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold tracking-tight">FoodCourt</span>
            </Link>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-sm text-gray-500 mt-2">Join us to order food or manage your outlet</p>
                </div>

                {/* Role Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-8">
                    <button
                        type="button"
                        onClick={() => setRole("customer")}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                            role === "customer" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <User className="w-4 h-4" />
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("outlet")}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                            role === "outlet" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Store className="w-4 h-4" />
                        Outlet Owner
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            required
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            required
                            type="password"
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {role === "outlet" && (
                        <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                <Store className="w-4 h-4 text-orange-600" />
                                Outlet Details
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                                <input
                                    required
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    placeholder="Tasty Bites"
                                    value={formData.outletName}
                                    onChange={(e) => setFormData({ ...formData, outletName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                                <input
                                    required
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    placeholder="e.g. Italian, Indian, Fast Food"
                                    value={formData.cuisine}
                                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Sign Up
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/features/Login" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}