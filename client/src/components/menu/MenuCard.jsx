import React from "react";

export default function MenuCard({ item }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 mt-1">{item.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-semibold text-green-600">${item.price}</span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
