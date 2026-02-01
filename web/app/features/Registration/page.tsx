"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Store, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

    return (
        <div>
            {/* Placeholder: Form will go here */}
        </div>
    );
}