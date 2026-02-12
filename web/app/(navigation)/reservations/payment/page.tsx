"use client";

import { fetcher } from "@/app/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, Smartphone, Loader2, Info, ChevronLeft, MapPin, Calendar, Clock, Users } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ROUTES } from "@/app/lib/routes";

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reservationId = searchParams.get("reservation_id");

    const [reservation, setReservation] = useState<any>(null);
    const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Form states
    const [phoneNumber, setPhoneNumber] = useState("");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: ""
    });

    useEffect(() => {
        if (!reservationId) {
            router.push(ROUTES.BOOKING);
            return;
        }

        const loadReservation = async () => {
            try {
                const data = await fetcher<any>(`/reservations/${reservationId}`);
                setReservation(data);
            } catch (err) {
                console.error("Failed to load reservation", err);
                alert("Invalid reservation session.");
                router.push(ROUTES.BOOKING);
            } finally {
                setIsFetching(false);
            }
        };
        loadReservation();
    }, [reservationId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call confirm endpoint
            await fetcher(`/reservations/${reservationId}/confirm`, {
                method: "PUT"
            });

            // Redirect to tracking or dashboard
            router.push(ROUTES.CUSTOMER_DASHBOARD);
        } catch (err) {
            console.error("Payment failed", err);
            alert("Payment failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                <header className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Complete Your Payment</h1>
                        <p className="text-gray-500 text-sm">One more step to secure your table.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left: Payment Form */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 order-2 md:order-1">
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                onClick={() => setMethod("mpesa")}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                    method === "mpesa" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-100 hover:border-green-200"
                                )}
                            >
                                <Smartphone className="h-6 w-6" />
                                <span className="text-xs font-bold">M-Pesa</span>
                            </button>
                            <button
                                onClick={() => setMethod("card")}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                    method === "card" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 hover:border-blue-200"
                                )}
                            >
                                <CreditCard className="h-6 w-6" />
                                <span className="text-xs font-bold">Card</span>
                            </button>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-4">
                            {method === "mpesa" && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="07XX XXX XXX"
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none font-medium"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 flex items-start gap-2">
                                        <Info className="w-3 h-3 mt-0.5 text-gray-400" />
                                        You'll receive an M-Pesa prompt on your phone to authorize the KSh 500 payment.
                                    </p>
                                </div>
                            )}

                            {method === "card" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                                            value={cardDetails.number}
                                            onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Expiry</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                                                value={cardDetails.expiry}
                                                onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">CVV</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="123"
                                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                                                value={cardDetails.cvv}
                                                onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 mt-6 bg-gray-900 !text-white font-black rounded-2xl shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Confirm & Pay KSh 500`
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Booking Summary Details */}
                    <div className="space-y-6 order-1 md:order-2">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wider mb-6">Reservation Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-50 p-3 rounded-2xl">
                                            <MapPin className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Outlet</p>
                                            <p className="font-bold text-gray-900">{reservation.outlet_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-50 p-3 rounded-2xl">
                                            <Info className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Table</p>
                                            <p className="font-bold text-gray-900">Table #{reservation.table_number}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-3 rounded-2xl">
                                                <Calendar className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">Date</p>
                                                <p className="font-bold text-gray-900">{new Date(reservation.time_reserved_for).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-3 rounded-2xl">
                                                <Users className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">Guests</p>
                                                <p className="font-bold text-gray-900">{reservation.number_of_guests}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Due Now</p>
                                    <p className="text-3xl font-black text-gray-900">KSh 500</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold uppercase">Non-Refundable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReservationPaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
