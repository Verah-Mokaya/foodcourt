"use client";

import { Order } from "@/lib/types";
import { Check, ChefHat, Clock } from "lucide-react";

interface OrdersProps {
    orders: Order[];
    updateStatus: (id: number, status: string) => void;
}

export default function Orders({ orders, updateStatus }: OrdersProps) {
    const pendingOrders = orders.filter(o => o.status === "pending");
    const preparingOrders = orders.filter(o => o.status === "preparing");
    const readyOrders = orders.filter(o => o.status === "ready");