import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, clearCart, total } = useContext(CartContext);
  const [success, setSuccess] = useState('');

  const handlePlaceOrder = async () => {
    if (!cart.length) return;

    const order = {
      userId: 1,
      items: cart.map(i => ({
        menuId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      })),
      status: 'pending',
      total,
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (!res.ok) throw new Error('Failed to place order');
      setSuccess('Order placed successfully!');
      clearCart();
    } catch (err) {
      setSuccess(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {!cart.length ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <ul className="space-y-4">
          {cart.map(item => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-white p-4 shadow rounded"
            >
              <div>
                <p className="font-semibold">{item.name} x {item.quantity}</p>
                <p className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
        <button
          onClick={handlePlaceOrder}
          disabled={!cart.length}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 disabled:opacity-50"
        >
          Place Order
        </button>
      </div>
      {success && <p className="mt-4 text-green-600 font-semibold">{success}</p>}
    </div>
  );
}
