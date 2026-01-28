import React, { useEffect, useState, useContext } from 'react';
import MenuGrid from '../components/menu/MenuGrid';
import { CartContext } from '../context/CartContext';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('http://localhost:4000/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading menu...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Menu</h1>
      <MenuGrid menuItems={menuItems} onAddToCart={addToCart} />
    </div>
  );
}
