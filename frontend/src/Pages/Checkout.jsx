// Checkout.jsx
import React, { useState,useEffect } from "react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";
import { useCart } from "../Context/CartContext";
import { placeOrder, createCheckoutSession,getMyAddresses } from "../API/api";
import { useNavigate } from "react-router-dom";
import { CheckCircle, X, Loader } from "lucide-react";
import { useAuth } from "../Context/AuthContext";



const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();
  const navigate = useNavigate();

  const { user } = useAuth(); // ✅ to know if user is logged in
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const response = await getMyAddresses();
          setSavedAddresses(response.data);
        } catch (err) {
          console.error("Error fetching saved addresses:", err);
        }
      };
      fetchAddresses();
    }
  }, [user]);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    instructions: "",
    discountCode: "",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError("Your cart is empty! Please add items before checkout.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Prepare order data for backend
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        instructions: formData.instructions,
        discount_code: formData.discountCode,
        payment_method: formData.paymentMethod,
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity || 1,
          price: parseFloat(item.price)
        })),
        total_amount: parseFloat(total)
      };

      // Send order to backend
      const response = await placeOrder(orderData);
      const createdOrderId = response.data.order_id;
      
      // If payment method is card, redirect to Stripe
      if (formData.paymentMethod === "card") {
        try {
          const checkoutResponse = await createCheckoutSession(createdOrderId);
          const checkoutUrl = checkoutResponse.data.url;
          
          // Clear cart before redirecting to Stripe
          clearCart();
          
          // Redirect to Stripe Checkout
          window.location.href = checkoutUrl;
        } catch (stripeError) {
          console.error("Error creating checkout session:", stripeError);
          setError("Failed to initiate payment. Please try again or choose Cash on Delivery.");
          setLoading(false);
        }
      } else {
        // COD: Show success message
        setSuccess(true);
        setOrderId(createdOrderId);
        clearCart();

        // Redirect to home after 7 seconds
        setTimeout(() => {
          navigate("/");
        }, 7000);
      }

    } catch (err) {
      console.error("Error placing order:", err);
      
      // Handle specific error messages from backend
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data) {
        // Handle validation errors
        const errors = Object.values(err.response.data).flat().join(", ");
        setError(errors || "Failed to place order. Please try again.");
      } else {
        setError("Failed to place order. Please check your connection and try again.");
      }
      setLoading(false);
    }
  };

  // Success Modal (for COD only, card payments redirect to Stripe)
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationBar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-2">
              Thank you for your order, {formData.name}!
            </p>
            <p className="text-gray-600 mb-6">
              Order ID: <span className="font-semibold">#{orderId}</span>
            </p>
            <p className="text-sm text-gray-500 mb-2">
              We'll send a confirmation email to {formData.email}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Payment Method: <span className="font-semibold">Cash on Delivery</span>
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            {/* ✅ Saved Addresses for Logged-In Users */}
            {user && savedAddresses.length > 0 && (
              <div className="mb-4">
                <label className="block font-semibold mb-2">Choose from Saved Addresses</label>
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                        selectedAddress === addr.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddress === addr.id}
                        onChange={() => {
                          setSelectedAddress(addr.id);
                          setFormData({
                            ...formData,
                            address: `${addr.street}, ${addr.city}, ${addr.zip_code}`,
                            phone: addr.phone || formData.phone,
                            name: formData.name || user?.name,
                            email: formData.email || user?.email,
                          });
                        }}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <p className="font-medium">{addr.type}</p>
                        <p className="text-gray-600 text-sm">{addr.street}</p>
                        <p className="text-gray-600 text-sm">
                          {addr.city}, {addr.zip_code}
                        </p>
                        {addr.phone && (
                          <p className="text-gray-500 text-sm">Phone: {addr.phone}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Address Entry (still visible if user wants to type a new one) */}
            <div>
              <label className="block font-semibold mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none disabled:bg-gray-100"
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
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none disabled:bg-gray-100"
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
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Payment Method *</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-4 h-4"
                  />
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-4 h-4"
                  />
                  <div>
                    <span className="font-medium">Credit / Debit Card</span>
                    <p className="text-sm text-gray-500">Secure payment via Stripe</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  {formData.paymentMethod === "card" ? "Redirecting to payment..." : "Processing..."}
                </>
              ) : (
                formData.paymentMethod === "card" ? "Proceed to Payment" : "Place Order"
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No items in cart.</p>
                <button
                  onClick={() => navigate("/category/view-all")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse Products →
                </button>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-gray-200 mb-4">
                  {cartItems.map((item, index) => (
                    <li key={index} className="py-3 flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ${parseFloat(item.price).toFixed(2)} × {item.quantity || 1}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Add More Items Button */}
                <button
                  onClick={() => navigate("/category/view-all")}
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