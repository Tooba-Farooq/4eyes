import React from 'react';
import { Link } from "react-router-dom";
import CustomerServicePage from '../../Pages/CustomerService';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">4Eyes</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium eyewear with cutting-edge virtual try-on technology.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons would go here */}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/category/eyeglasses" className="hover:text-white transition-colors">Eyeglasses</Link></li>
              <li><Link to="/category/sunglasses" className="hover:text-white transition-colors">Sunglasses</Link></li>
              <li><Link to="/category/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/customer-service#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/customer-service#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/customer-service#returns" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="/customer-service#shipping" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="/customer-service#size-guide" className="hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 4Eyes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
