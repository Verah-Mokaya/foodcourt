"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

interface MenuItemFormProps {
    onAdd: (item: any) => Promise<void>;
    isSubmitting: boolean;
}