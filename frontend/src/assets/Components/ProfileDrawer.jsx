import React from "react";
import { X, ShoppingBag, MapPin, Heart, Ticket, Star, Settings, LogOut } from "lucide-react";

const ProfileDrawer = ({ isOpen, onClose, user }) => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Menu options — each represents a section of the user profile
  const menuItems = [
    { icon: <ShoppingBag size={18} />, label: "My Orders", route: "/orders" },
    { icon: <MapPin size={18} />, label: "Saved Addresses", route: "/addresses" },
    { icon: <Heart size={18} />, label: "Favourites", route: "/favourites" },
    { icon: <Ticket size={18} />, label: "Discount Coupons", route: "/coupons" },
    { icon: <Star size={18} />, label: "My Reviews", route: "/reviews" },
    { icon: <Settings size={18} />, label: "Account Settings", route: "/settings" },
  ];

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-xl font-semibold">My Profile</h2>
          <button onClick={onClose} className="hover:text-red-500 transition">
            <X size={22} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-5 border-b bg-gray-50 rounded-b-xl">
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
          <p className="text-sm text-gray-600">{user?.phone}</p>
        </div>

        {/* Menu Sections */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-220px)]">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => console.log(`Navigate to ${item.route}`)} // 🔗 Replace with navigate() later
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
