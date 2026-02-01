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