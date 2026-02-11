"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

interface MenuItemFormProps {
    onAdd: (item: any) => Promise<void>;
    isSubmitting: boolean;
}

export default function MenuItemForm({ onAdd, isSubmitting }: MenuItemFormProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Main");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [preparationTime, setPreparationTime] = useState("15");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onAdd({ name, price, category, image, description, preparation_time: Number(preparationTime) });
        setName("");
        setPrice("");
        setImage("");
        setDescription("");
        setPreparationTime("15");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Add New Menu Item</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Spicy Chicken"
                        className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Price (Ksh)</label>
                    <input
                        required
                        type="number"
                        placeholder="450"
                        className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select
                        className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option>Main</option>
                        <option>Appetizer</option>
                        <option>Side</option>
                        <option>Drink</option>
                        <option>Dessert</option>
                    </select>
                </div>  
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Preparation Time (Mins)</label>
                    <input
                        required
                        type="number"
                        placeholder="15"
                        min="1"
                        className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={preparationTime}
                        onChange={e => setPreparationTime(e.target.value)}
                    />
                </div> 
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Image URL (Optional)</label>
                    <input
                        type="url"
                        placeholder="https://images.unsplash.com..."
                        className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea
                        placeholder="Describe this delicious item..."
                        className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 min-h-[44px]"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <Plus className="w-5 h-5" />
                        Add to Menu
                    </>
                )}
            </button>
        </form>
    );
}