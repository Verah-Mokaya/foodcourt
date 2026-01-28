import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
