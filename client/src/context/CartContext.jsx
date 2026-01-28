import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
