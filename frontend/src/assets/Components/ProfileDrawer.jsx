import React from "react";
import { X, ShoppingBag, MapPin, Heart, Ticket, Star, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../Context/AuthContext"; // adjust path
import { useNavigate } from "react-router-dom";

const ProfileDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         // clears user and localStorage
    onClose();        // close drawer
    navigate("/");    // redirect to home
  };

  if (!user) return null; // don't show drawer if user is not logged in

  const menuItems = [
  { icon: <ShoppingBag size={18} />, label: "My Orders", section: "orders" },
  { icon: <MapPin size={18} />, label: "Saved Addresses", section: "addresses" },
  { icon: <Heart size={18} />, label: "Favourites", section: "favourites" },
  { icon: <Ticket size={18} />, label: "Discount Coupons", section: "coupons" },
  { icon: <Settings size={18} />, label: "Account Settings", section: "settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2
        className="text-xl font-semibold cursor-pointer hover:text-blue-600 transition"
        onClick={() => {
          navigate("/myprofile");
          onClose(); // close drawer when navigating
        }}
      >
        My Profile
      </h2>

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
          {menuItems.map((item) => (
            <button
              key={item.section}
              onClick={() => {
                navigate(`/myprofile/${item.section}`);
                onClose(); // close drawer
              }}
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
