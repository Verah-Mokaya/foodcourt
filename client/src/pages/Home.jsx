'use client';
import React, { useEffect, useState } from "react";
import { MenuItem } from "../components/MenuItem";
import { fetchMenu } from "../services/api.jsx";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await fetchMenu();
        setMenu(data);
      } catch (error) {
        console.error("Failed to load menu:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading menu...</p>;
  if (!menu.length) return <p className="text-center mt-10">No menu items available</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {menu.map(item => (
        <MenuItem key={item.id} {...item} />
      ))}
    </div>
  );
}
