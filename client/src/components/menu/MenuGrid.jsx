import React from "react";
import MenuCard from "./MenuCard"

export default function Menucgrid({items}) {
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
         {items.map((item) => (
           <MenuCard key={item.id} item={item} />
      ))}
    </div>
    );
}