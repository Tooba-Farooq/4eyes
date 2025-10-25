import React, { useContext } from "react";
import {CartContext} from "../Context/CartContext"; 
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty 🛒</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                <div className="flex-1 ml-4">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-gray-500">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 border rounded p-1"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
