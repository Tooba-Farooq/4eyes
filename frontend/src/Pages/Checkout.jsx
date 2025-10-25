// AboutPage.jsx
import React from "react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";

const Checkout = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      </main>




      <Footer />
    </div>
  );
};

export default Checkout;
