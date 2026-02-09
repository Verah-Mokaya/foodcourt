"use client";

import { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";

type PaymentMethod = "mpesa" | "card" | "cash";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onConfirm: (method: string, details: any) => Promise<void>;
}

export default function PaymentModal({ isOpen, onClose, total, onConfirm }: PaymentModalProps) {
    const [method, setMethod] = useState<PaymentMethod>("mpesa");
    const [isLoading, setIsLoading] = useState(false);

    // M-Pesa State
    const [phoneNumber, setPhoneNumber] = useState("");

    // Card State
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: ""
    });

    if (!isOpen) return null;

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        await onConfirm(method, {
            phoneNumber: method === "mpesa" ? phoneNumber : undefined,
            card: method === "card" ? { ...cardDetails, number: "**** " + cardDetails.number.slice(-4) } : undefined
        });

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Payment</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 text-center">
                        <span className="text-sm text-gray-500">Total Amount</span>
                        <div className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button
                            onClick={() => setMethod("mpesa")}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                                method === "mpesa" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200 hover:border-green-200"
                            )}
                        >
                            <Smartphone className="h-6 w-6" />
                            <span className="text-xs font-bold">M-Pesa</span>
                        </button>
                        <button
                            onClick={() => setMethod("card")}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                                method === "card" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-200"
                            )}
                        >
                            <CreditCard className="h-6 w-6" />
                            <span className="text-xs font-bold">Card</span>
                        </button>
                        <button
                            onClick={() => setMethod("cash")}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                                method === "cash" ? "border-orange-600 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-orange-200"
                            )}
                        >
                            <Banknote className="h-6 w-6" />
                            <span className="text-xs font-bold">Cash</span>
                        </button>
                    </div>

                    <form onSubmit={handlePay} className="space-y-4">
                        {method === "mpesa" && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="07XX XXX XXX"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                />
                                <p className="text-xs text-gray-500">You will receive an STK push on your phone.</p>
                            </div>
                        )}

                        {method === "card" && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        value={cardDetails.number}
                                        onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            value={cardDetails.expiry}
                                            onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="123"
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            value={cardDetails.cvv}
                                            onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {method === "cash" && (
                            <div className="p-4 bg-orange-50 rounded-xl text-sm text-orange-800 animate-in fade-in slide-in-from-top-2">
                                Please pay at the counter/cashier when collecting your order.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay $${total.toFixed(2)}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}