"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { Calendar, Users, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/app/lib/routes";

