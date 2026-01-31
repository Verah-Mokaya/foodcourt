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

