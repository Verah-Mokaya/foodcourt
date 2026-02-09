"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { MenuItem } from "@/app/lib/types";
import { useEffect, useState } from "react";
import MenuItemForm from "../components/MenuItemForm";
import MenuTable from "../components/MenuTable";
