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
