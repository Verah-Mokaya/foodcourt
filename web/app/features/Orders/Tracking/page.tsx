"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function OrderTrackingPage() {
    const searchParams = useSearchParams();