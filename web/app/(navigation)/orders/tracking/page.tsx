"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/app/lib/routes";

export default function OrderTrackingPage() {
    const searchParams = useSearchParams();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Your payment was successful and your order has been sent to the kitchen.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/features/Orders/History"
                        className="block w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors"
                    >
                        Track Order
                    </Link>
                    <Link
                        href="/features/MenuBrowsing"
                        className="block w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Back to Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}