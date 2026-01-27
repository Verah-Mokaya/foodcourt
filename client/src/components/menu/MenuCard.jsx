import React from "react";
 export default function MenuCard ({item}) {
    return(
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <img
        src={item.image_url}
        alt={item.item_name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{item.item_name}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-blue-600 font-semibold">
            KSh {item.price}
          </span>
        </div>
      </div>
    </div>
    );
 }