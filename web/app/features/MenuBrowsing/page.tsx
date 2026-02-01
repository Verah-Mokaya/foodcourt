"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { MenuItem, Outlet } from "@/lib/types";
import MenuCard from "./components/MenuCard";
import FilterSidebar from "./components/FilterSidebar";
import MenuItemModal from "./components/MenuItemModal";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Filter } from "lucide-react";

export default function MarketplacePage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const { itemCount, total } = useCart();

    return <div>{/* Placeholder */}</div>;
}