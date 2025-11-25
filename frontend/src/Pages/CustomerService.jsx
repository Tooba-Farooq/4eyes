import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";

const CustomerServicePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        // Get the navbar height (approximately 64px)
        const navbarHeight = 80; // Adjust this value based on your navbar height
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // Scroll to top when no hash is present
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBar />

      <main className="flex-grow py-16 container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Customer Service</h1>

        {/* Contact Us */}
        <section id="contact" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            You can reach us at <a href="ayeshaghbhatti@gmail.com" className="text-blue-600">ayeshaghbhatti@gmail.com</a> or call +1 234 567 890.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          <p className="text-gray-700">Here you can find answers to the most common questions about our products and services.</p>
        </section>

        {/* Returns */}
        <section id="returns" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">Returns & Refund Policy</h2>
          <p className="text-gray-700">We accept returns within 30 days. Items must be unused and in original packaging.</p>
        </section>

        {/* Shipping */}
        <section id="shipping" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
          <p className="text-gray-700">Orders are processed within 1-2 business days. Standard delivery takes 5-7 days.</p>
        </section>

        {/* Size Guide */}
        <section id="size-guide" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">Size Guide</h2>
          <p className="text-gray-700">Updating Soon.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerServicePage;