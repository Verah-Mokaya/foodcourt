import React from "react";
import MenuGrid from "../components/menu/MenuGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-yellow-200 via-red-200 to-pink-200 py-20 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to FoodCourt
        </h1>
        <p className="text-gray-700 text-lg">
          Discover delicious meals and order online!
        </p>
      </div>

      {/* Menu grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Menu</h2>
        <MenuGrid />
      </div>
    </div>
  );
}
