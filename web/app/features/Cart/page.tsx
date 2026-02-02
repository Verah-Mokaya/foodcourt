"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fetcher, API_URL } from "@/lib/api";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PaymentModal from "./components/PaymentModal";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const handleCheckout = async (paymentMethod: string, paymentDetails: any) => {
        // Checkout logic placeholder
    };

    return <div>Cart Page</div>;
}