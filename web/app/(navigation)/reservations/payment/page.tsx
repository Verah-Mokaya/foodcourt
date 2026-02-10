"use client";

import { fetcher } from "@/app/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    CreditCard,
    Smartphone,
    Loader2,
    Info,
    ChevronLeft,
    MapPin,
    Calendar,
    Users
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ROUTES } from "@/app/lib/routes";

export default function ReservationPaymentPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                </div>
            }
        >
            <PaymentContent />
        </Suspense>
    );
}
function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reservationId = searchParams.get("reservation_id");

    const [reservation, setReservation] = useState<any>(null);
    const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

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
            await new Promise(resolve => setTimeout(resolve, 2000));

            await fetcher(`/reservations/${reservationId}/confirm`, {
                method: "PUT"
            });

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
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Complete Your Payment
                        </h1>
                        <p className="text-gray-500 text-sm">
                            One more step to secure your table.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
