// Checkout.jsx
import React, { useState } from "react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";
import { useCart } from "../Context/CartContext";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    instructions: "",
    discountCode: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add items before checkout.");
      return;
    }

    console.log("Checkout Data:", formData);
    alert("Order placed successfully! 🎉");

    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Special Instructions (Optional)
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Discount Code (Optional)
              </label>
              <input
                type="text"
                name="discountCode"
                value={formData.discountCode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                  />
                  <span>Credit / Debit Card</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Place Order
            </button>
          </form>

          {/* Order Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">No items in cart.</p>
            ) : (
                <>
                <ul className="divide-y divide-gray-200 mb-4">
                    {cartItems.map((item, index) => (
                    <li key={index} className="py-2 flex justify-between">
                        <span>
                        {item.name} × {item.quantity || 1}
                        </span>
                        <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </li>
                    ))}
                </ul>

                <div className="flex justify-between font-semibold text-lg mb-4">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                {/* Add More Items Button */}
                <button
                    onClick={() => (window.location.href = "/")}
                    className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                    + Add More Items
                </button>
                </>
            )}
            </div>



        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
