// PaymentCancel.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // Auto-redirect to cart or home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/cart");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Payment Canceled
          </h2>
          <p className="text-gray-600 mb-2">
            Your payment was not completed.
          </p>
          {orderId && (
            <p className="text-gray-600 mb-6">
              Order ID: <span className="font-semibold">#{orderId}</span>
            </p>
          )}
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 mb-2">
              ❌ Payment was canceled or failed
            </p>
            <p className="text-sm text-gray-700">
              You can try again or choose a different payment method.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Retry Payment
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="w-full border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCancel;
