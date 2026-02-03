"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/app/lib/routes";
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
            const id = String(item.outletId);
            if (!acc[id]) acc[id] = [];
            acc[id].push(item);
            return acc;
        }, {} as Record<string, typeof items>);

        try {
            const promises = Object.entries(itemsByOutlet).map(async ([outletId, outletItems]) => {
                const outletTotal = outletItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

                const orderData = {
                    customer_id: user.id,
                    outlet_id: Number(outletId),
                    total_amount: outletTotal,
                    status: "pending",
                    created_at: new Date().toISOString(),
                    order_items: outletItems.map(i => ({
                        menu_item_id: i.menuItemId,
                        quantity: i.quantity,
                        price: i.price
                    })),
                    payment_info: {
                        method: paymentMethod,
                        ...paymentDetails
                    }
                };

                return fetcher("/orders", {
                    method: "POST",
                    body: JSON.stringify(orderData)
                });
            });

            await Promise.all(promises);

            clearCart();
            setIsPaymentOpen(false);
            router.push(ROUTES.ORDERS_TRACKING);
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
                <Link href={ROUTES.MARKETPLACE} className="px-6 py-2 bg-orange-600 !text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-24">
            <header className="flex items-center gap-4 mb-6">
                <Link href={ROUTES.MARKETPLACE} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 !text-gray-700 dark:text-gray-200" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
            </header>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.menuItemId} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="h-20 w-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                            {/* Placeholder image */}
                            <div className="w-full h-full bg-gray-300" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500">{item.outletName}</p>
                                </div>
                                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(Number(item.menuItemId), -1)}
                                        className="p-1 hover:bg-white rounded shadow-sm transition-colors"
                                    >
                                        <Minus className="h-3 w-3 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(Number(item.menuItemId), 1)}
                                        className="p-1 hover:bg-white rounded shadow-sm transition-colors"
                                    >
                                        <Plus className="h-3 w-3 text-gray-600" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(Number(item.menuItemId))}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => setIsPaymentOpen(true)}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Proceed to Checkout
                </button>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                total={total}
                onConfirm={handleCheckout}
            />
        </div>
    );
}