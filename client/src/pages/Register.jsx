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



