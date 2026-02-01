"use client";

import { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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