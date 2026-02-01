"use client";

import { useAuth } from "@/context/AuthContext";
import { fetcher, API_URL } from "@/lib/api";
import { MenuItem } from "@/lib/types";
import { useEffect, useState } from "react";
import MenuItemForm from "../components/MenuItemForm";
import MenuTable from "../components/MenuTable";