"use client";

import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface MenuItemModalProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
    outletName: string;
}

