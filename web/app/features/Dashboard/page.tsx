"use client";

import { useAuth } from "@/context/AuthContext";
import { fetcher, API_URL } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import DashboardHome from "./components/DashboardHome";
import Orders from "./components/Orders";