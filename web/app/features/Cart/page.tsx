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
        if (!user) return;
        setIsSubmitting(true);

        const itemsByOutlet = items.reduce((acc, item) => {
            if (!acc[item.outletId]) acc[item.outletId] = [];
            acc[item.outletId].push(item);
            return acc;
        }, {} as Record<number, typeof items>);

        try {
            const promises = Object.entries(itemsByOutlet).map(async ([outletId, outletItems]) => {
                const outletTotal = outletItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

                const orderData = {
                    customer_id: user.id,
                    outlet_id: Number(outletId),
                    total_amount: outletTotal,
                    status: "pending",
                    created_at: new Date().toISOString(),
                    order_items: outletItems.map(i => ({ // Updated to matched schema
                        menu_item_id: i.menuItemId,
                        quantity: i.quantity,
                        price: i.price
                    })),
                    payment_info: { // Mocking saving payment info if backend supported it
                        method: paymentMethod,
                        ...paymentDetails
                    }
                };

                await fetch(`${API_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData)
                });
            });

            await Promise.all(promises);

            clearCart();
            setIsPaymentOpen(false);
            router.push("/features/Orders/Tracking"); // Updated redirect path
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Failed to place order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
                <Link href="/features/MenuBrowsing" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return <div>Cart Page</div>;
}