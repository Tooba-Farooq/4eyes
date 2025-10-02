import React from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const SignInPrompt = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative bg-white w-[90%] max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-6"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Sign in to save favorites
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Sign in to see items you’ve previously liked and save new favorites.
        </p>

        {/* Buttons */}
       <Link to="/login" className="block">
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
                Sign In
            </button>
        </Link>

        <button
          onClick={onClose}
          className="w-full mt-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default SignInPrompt;
