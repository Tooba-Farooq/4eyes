// AboutPage.jsx
import React from "react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <section className="py-16 container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          At 4Eyes, we believe eyewear is more than just vision—it’s style, comfort, 
          and technology. Our mission is to provide premium quality glasses with 
          innovative features like virtual try-on and custom prescriptions.
        </p>
        <p className="mt-4 text-lg text-gray-700">
          Founded in 2024, we are committed to making eyewear accessible, stylish, 
          and reliable worldwide.
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
