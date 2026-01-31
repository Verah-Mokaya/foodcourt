"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Store, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState("customer");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    outletName: "",
    cuisine: ""
  });

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Check if email exists
      const checkRes = await fetch(`http://localhost:3001/users?email=${formData.email}`);
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        alert("Email already exists");
        setIsLoading(false);
        return;
      }

          // 2. Create User
      const userPayload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: role
      };

      const userRes = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload)
      });

      const newUser = await userRes.json();

          // 3. If Owner, Create Outlet
      if (role === "owner") {
        const outletPayload = {
          owner_id: newUser.id,
          name: formData.outletName,
          cuisine: formData.cuisine,
          description: `Welcome to ${formData.outletName}`,
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
        };

        const outletRes = await fetch("http://localhost:3001/outlets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(outletPayload)
        });

        const newOutlet = await outletRes.json();

        await fetch(`http://localhost:3001/users/${newUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ outletId: newOutlet.id })
        });
      }

      // 4. Auto Login
      await login(formData.email, formData.password);

          } catch (error) {
      console.error("Signup failed", error);
      alert("Something went wrong");
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
            onClick={() => setRole("owner")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
              role === "owner" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Store className="w-4 h-4" />
            Outlet Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Full Name" required className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input placeholder="Email" required type="email" className="w-full p-2.5 border rounded-lg" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input placeholder="Password" required type="password" className="w-full p-2.5 border rounded-lg" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

          {role === "owner" && (
            <>
              <input placeholder="Outlet Name" required className="w-full p-2.5 border rounded-lg" value={formData.outletName} onChange={(e) => setFormData({ ...formData, outletName: e.target.value })} />
              <input placeholder="Cuisine Type" required className="w-full p-2.5 border rounded-lg" value={formData.cuisine} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })} />
            </>
          )}

          <button disabled={isLoading} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl flex justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}



