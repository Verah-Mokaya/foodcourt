"use client";

import { useAuth } from "@/context/AuthContext";
import { fetcher, API_URL } from "@/lib/api";
import { Table } from "@/lib/types";
import { useEffect, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";