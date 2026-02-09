import { MenuItem } from "@/app/lib/types";
import { Trash2 } from "lucide-react";

interface MenuTableProps {
    items: MenuItem[];
    onDelete: (id: number) => void;
}