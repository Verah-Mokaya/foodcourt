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