import React from 'react';
import MenuCard from './MenuCard';

export default function MenuGrid({ menuItems, onAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {menuItems.map(item => (
        <MenuCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
