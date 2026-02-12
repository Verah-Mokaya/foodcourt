"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { Minus, Plus, Trash2, ArrowLeft, Store, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/app/lib/routes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PaymentModal from "./components/PaymentModal";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
    const [tableNumber, setTableNumber] = useState("");
    const [reservations, setReservations] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        const loadReservations = async () => {
            try {
                const data = await fetcher<any>("/reservations/my");
                setReservations(data.reservations || []);
            } catch (err) {
                console.error("Failed to load reservations", err);
            }
        };
        loadReservations();
    }, [user]);

    const activeOutletsInCart = Array.from(new Set(items.map(i => String(i.outletId))));

    // Find matching confirmed reservations
    const applicableReservations = reservations.filter(res =>
        res.status === "confirmed" &&
        !res.is_fee_deducted &&
        activeOutletsInCart.includes(String(res.outlet_id))
    );

    const discountAmount = applicableReservations.length * 500;
    const finalTotal = Math.max(0, total - discountAmount);


    const handleCheckout = async (paymentMethod: string, paymentDetails: any) => {
        if (!user) return;

        // Validation for table number (required for both dine-in and takeaway)
        if (!tableNumber.trim()) {
            alert("Please enter a table number.");
            return;
        }

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

                // Find if there's an applicable reservation for THIS specific outlet
                const outletRes = applicableReservations.find(res => String(res.outlet_id) === outletId);

                const orderData = {
                    customer_id: user.id,
                    outlet_id: Number(outletId),
                    total_amount: outletTotal,
                    status: "pending",
                    created_at: new Date().toISOString(),
                    order_type: orderType,
                    table_number: tableNumber,
                    reservation_id: outletRes?.id || null,
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
                <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
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
                                <p className="font-semibold text-gray-900">KSh {(item.price * item.quantity).toFixed(2)}</p>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(Number(item.menuItemId), -1)}
                                        className="p-1 hover:bg-white rounded shadow-sm transition-colors"
                                    >
                                        <Minus className="h-3 w-3 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium w-4 text-center text-gray-700">{item.quantity}</span>
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

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">

                {/* Order Context Inputs - Premium Styling */}
                <div className="mb-6 space-y-4">
                    {/* Dine-in / Takeaway Selection (Segmented Control) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setOrderType("dine-in")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${orderType === "dine-in"
                                    ? "bg-white text-orange-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <span className="bg-orange-100 p-1 rounded-full"><Store className="w-4 h-4" /></span>
                                Dine-in
                            </button>
                            <button
                                onClick={() => setOrderType("takeaway")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${orderType === "takeaway"
                                    ? "bg-white text-orange-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <span className="bg-orange-100 p-1 rounded-full"><ArrowRight className="w-4 h-4" /></span>
                                Takeaway
                            </button>
                        </div>
                    </div>

                    {/* Table Number Input - Premium Styling */}
                    <div className="animate-in fade-in slide-in-from-top-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Table Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="Enter your table number"
                                className={`
                                    w-full pl-4 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all
                                    ${!tableNumber.trim() ? "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" : "border-orange-500 bg-orange-50/30"}
                                `}
                            />
                            {tableNumber.trim() && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            Required for service tracking
                        </p>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900 font-medium">KSh {total.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-right-1">
                            <span className="text-green-600 font-medium flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                Reservation Deposit
                            </span>
                            <span className="text-green-600 font-bold">-KSh {discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-gray-900 font-bold">Payable Now</span>
                        <span className="text-2xl font-black text-orange-600">KSh {finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsPaymentOpen(true)}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-900/20 hover:bg-orange-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    Proceed to Payment
                </button>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                total={finalTotal}
                onConfirm={handleCheckout}
            />
        </div>
    );
}