import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    getTotalPrice, 
    updateQuantity 
  } = useCart();

  const navigate = useNavigate();
  const total = getTotalPrice();

  const [warning, setWarning] = useState("");
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [isCartOpen]); // Re-check when drawer opens

  // Handle checkout click
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setWarning("🛒 Your cart is empty! Please add items before proceeding to checkout.");
      setTimeout(() => setWarning(""), 3000);
      return;
    }

    if (user) {
      // Logged in → go straight to checkout
      closeCart();
      navigate("/checkout");
    } else {
      // Guest → show checkout options modal
      setShowCheckoutOptions(true);
    }
  };

  return (
    <>
      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all ${
          isCartOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isCartOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={closeCart}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button onClick={closeCart}>
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
                {cartItems.map((item) => (
                  <div
                    key={item.id}
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

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.id, item.quantity - 1)
                              : removeFromCart(item.id)
                          }
                          className="px-2 py-1 border rounded-l bg-gray-100 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="px-3 border-t border-b">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border rounded-r bg-gray-100 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            {cartItems.length > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
            )}

            {/* Checkout Button - Changes based on login status */}
            {user ? (
              // Logged in user - Single checkout button
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            ) : (
              // Guest user - Show checkout options button
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            )}

            {/* View Cart */}
            <button
              onClick={() => {
                closeCart();
                navigate("/cart");
              }}
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              View Cart
            </button>

            {/* Warning */}
            {warning && (
              <div className="text-center text-red-500 text-sm font-medium mt-2 animate-fadeIn">
                {warning}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guest Checkout Options Modal - Only shown for non-logged-in users */}
      {showCheckoutOptions && !user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-96 text-center shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Checkout Options</h2>
            <p className="text-gray-600 mb-6">
              You can checkout as a guest or login to save your order history and track your orders.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowCheckoutOptions(false);
                  closeCart();
                  navigate("/checkout"); // Guest checkout
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Continue as Guest
              </button>

              <button
                onClick={() => {
                  setShowCheckoutOptions(false);
                  closeCart();
                  navigate("/login", { state: { from: "/checkout" } }); // Login with redirect
                }}
                className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                Login / Sign Up
              </button>

              <button
                onClick={() => setShowCheckoutOptions(false)}
                className="mt-2 text-gray-500 hover:text-gray-700 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;