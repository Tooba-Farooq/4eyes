import React from "react";
import { X } from "lucide-react";

const CartDrawer = ({ isOpen, onClose, cartItems }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              Your cart is empty 🛒
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1 ml-3">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-gray-600 text-sm">${item.price}</p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    x{item.quantity || 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Checkout
          </button>
          <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition">
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
