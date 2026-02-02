"use client";

import { Order } from "@/lib/types";
import { Check, ChefHat, Clock } from "lucide-react";

interface OrdersProps {
    orders: Order[];
    updateStatus: (id: number, status: string) => void;
}