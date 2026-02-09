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