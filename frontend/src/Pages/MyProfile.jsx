import React, { useState, useEffect } from "react";
import { ShoppingBag, MapPin, Heart, Ticket, Settings, LogOut, Package, Calendar, DollarSign, Trash2, Edit, Loader2 } from "lucide-react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { X, Check } from "lucide-react";
import ProductCard from "../assets/Components/ProductCard";
import { 
  getMyOrders,
  getMyAddresses, 
  addAddress,
  updateAddress, 
  deleteAddress, 
  getMyFavourites, 
  removeFromFavourites,
  getMyCoupons,
  getProfile,
  updateProfile,
  changePassword
} from "../API/api";

// Profile menu items
const menuItems = [
  { icon: <ShoppingBag size={18} />, label: "My Orders", key: "orders" },
  { icon: <MapPin size={18} />, label: "Saved Addresses", key: "addresses" },
  { icon: <Heart size={18} />, label: "Favourites", key: "favourites" },
  { icon: <Ticket size={18} />, label: "Discount Coupons", key: "coupons" },
  { icon: <Settings size={18} />, label: "Account Settings", key: "settings" },
];

// Content Components
const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Failed to load orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h3>
        <p className="text-gray-500">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order #{order.order_number || order.id}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                  <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "Delivered" ? "bg-green-100 text-green-700" :
                order.status === "Confirmed" ? "bg-green-100 text-green-700" :
                order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                order.status === "Awaiting Payment" ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {order.status}
              </span>
            </div>
            
            {/* Order Items Display */}
            {order.items && order.items.length > 0 && (
              <div className="mb-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{item.product_name}</p>
                      <p className="text-gray-500">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-3 border-t">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Package size={14} /> {order.items?.length || 0} items
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={14} /> ${parseFloat(order.total_amount).toFixed(2)}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.is_paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.is_paid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const AddressesContent = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: "Home",
    street: "",
    city: "",
    zip_code: "",
    phone: "",
    is_default: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getMyAddresses();
      setAddresses(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to load addresses");
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        setDeleting(addressId);
        await deleteAddress(addressId);
        setAddresses(addresses.filter(addr => addr.id !== addressId));
      } catch (err) {
        alert(err.response?.data?.error || err.response?.data?.message || "Failed to delete address");
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      zip_code: address.zip_code,
      phone: address.phone || "",
      is_default: address.is_default
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      type: "Home",
      street: "",
      city: "",
      zip_code: "",
      phone: "",
      is_default: false
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    // Validation
    if (!formData.street.trim()) {
      setFormError("Street address is required");
      return;
    }
    if (!formData.city.trim()) {
      setFormError("City is required");
      return;
    }
    if (!formData.zip_code.trim()) {
      setFormError("ZIP code is required");
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingAddress) {
        // Update existing address
        const response = await updateAddress(editingAddress.id, formData);
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? response.data : addr
        ));
      } else {
        // Add new address
        const response = await addAddress(formData);
        setAddresses([...addresses, response.data]);
      }
      
      // Reset form and close modal
      setFormData({
        type: "Home",
        street: "",
        city: "",
        zip_code: "",
        phone: "",
        is_default: false
      });
      setShowModal(false);
      setEditingAddress(null);
    } catch (err) {
      setFormError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        (editingAddress ? "Failed to update address" : "Failed to add address")
      );
      console.error("Error saving address:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Saved Addresses</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Addresses Yet</h3>
          <p className="text-gray-500">Add a delivery address to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-6 rounded-lg shadow-sm border relative">
              {addr.is_default && (
                <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  Default
                </span>
              )}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{addr.type}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditAddress(addr)}
                    className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    disabled={deleting === addr.id}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    disabled={deleting === addr.id}
                  >
                    {deleting === addr.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-1">{addr.street}</p>
              <p className="text-gray-600">{addr.city}, {addr.zip_code}</p>
              {addr.phone && <p className="text-gray-500 text-sm mt-2">Phone: {addr.phone}</p>}
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={handleAddNew}
        className="mt-4 bg-white p-6 rounded-lg shadow-sm border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center w-full"
      >
        <span className="text-blue-600 font-medium">+ Add New Address</span>
      </button>

      {/* Add/Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP code"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_default" className="text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      {editingAddress ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingAddress ? "Update Address" : "Add Address"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


const FavouritesContent = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const response = await getMyFavourites();
      setFavourites(response.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load favourites"
      );
      console.error("Error fetching favourites:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update local favourites instantly when a product is removed from favourites
  const handleFavouriteToggle = (productId) => {
    setFavourites((prev) => prev.filter((item) => item.product?.id !== productId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Favourites Yet
        </h3>
        <p className="text-gray-500">
          Add products to your wishlist to see them here!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Favourites</h2>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {favourites.map((item) => (
          <ProductCard
            key={item.id}
            product={item.product}
            onFavouriteRemoved={handleFavouriteToggle}
          />
        ))}
      </div>
    </div>
  );
};

const CouponsContent = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await getMyCoupons();
        setCoupons(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Failed to load coupons");
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Coupons Available</h3>
        <p className="text-gray-500">Check back later for discount coupons!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Discount Coupons</h2>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white p-6 rounded-lg shadow-sm border border-dashed border-blue-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-xl font-bold text-blue-600 mb-2">{coupon.code}</div>
                <p className="text-gray-700 font-semibold">{coupon.discount}</p>
                <p className="text-gray-500 text-sm mt-1">Min. order: ${coupon.min_order}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => handleCopyCode(coupon.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copiedCode === coupon.code 
                    ? "bg-green-600 text-white" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {copiedCode === coupon.code ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsContent = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [message, setMessage] = useState(null);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchingProfile(true);
        const response = await getProfile();
        setProfileData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage({ 
          type: "error", 
          text: "Failed to load profile data" 
        });
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      
      const response = await updateProfile(profileData);
      
      // Update user context with new data
      if (setUser) {
        setUser(prev => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        }));
      }
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || err.response?.data?.message || "Failed to update profile" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters!" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error("Password change error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || err.response?.data?.message || "Failed to change password" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
      
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="font-semibold mb-4">Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input 
              type="tel" 
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input 
              type="password" 
              placeholder="Enter current password" 
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password (min 8 characters)" 
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password" 
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState(section || "orders");

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (section) setActiveSection(section);
  }, [section]);

  const handleSectionChange = (key) => {
    setActiveSection(key);
    navigate(`/myprofile/${key}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "orders": return <OrdersContent />;
      case "addresses": return <AddressesContent />;
      case "favourites": return <FavouritesContent />;
      case "coupons": return <CouponsContent />;
      case "settings": return <SettingsContent />;
      default: return <OrdersContent />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar/>
      
      <div className="bg-white shadow-sm py-6 px-6 mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name || "Guest"}!
          </h1>
          <p className="text-gray-600 mt-1">{user?.email}</p>
        </div>
      </div>

      <section className="container mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="pb-4 mb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "G"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.name || "Guest"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleSectionChange(item.key)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
                      activeSection === item.key
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 mt-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderContent()}
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default ProfilePage;