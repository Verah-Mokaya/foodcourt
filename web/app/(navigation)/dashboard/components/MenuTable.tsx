import { MenuItem } from "@/app/lib/types";
import { Trash2 } from "lucide-react";

interface MenuTableProps {
    items: MenuItem[];
    onDelete: (id: number) => void;
}

export default function MenuTable({ items, onDelete }: MenuTableProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Current Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="h-20 w-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                            <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-gray-900">{item.item_name}</h3>
                                <button onClick={() => onDelete(Number(item.id))} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                            <div className="flex justify-between items-end mt-2">
                                <p className="font-semibold text-gray-900">${item.price !== undefined ? item.price.toFixed(2) : "0.00"}</p>
                                <div className={`text-xs px-2 py-1 rounded-full ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.is_available ? 'Available' : 'Unavailable'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}