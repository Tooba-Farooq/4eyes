import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import CartDrawer from "./CartDrawer";
import SignInPrompt from "./Fav";
import { useCart } from "../../Context/CartContext";
import ProfileDrawer from "./ProfileDrawer";
import { useLocation } from "react-router-dom";
import { searchProducts } from "../../API/api";
import { useAuth } from "../../Context/AuthContext";


const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);


  const { getTotalItems, openCart } = useCart();  // ADD THIS
  const cartItemsCount = getTotalItems();  // ADD THIS
  const navDropdownRef = useRef();
  const profileDropdownRef = useRef();
  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout";
  const searchRef = useRef();
  const navigate = useNavigate();

  const { user, setUser, logout } = useAuth();

  // Debounced search
useEffect(() => {
  if (searchQuery.trim().length < 2) {
    setSearchResults([]);
    setShowSearchDropdown(false);
    return;
  }

  setIsSearching(true);
  const timer = setTimeout(async () => {
    try {
      const response = await searchProducts(searchQuery);
      setSearchResults(response.data); // Axios stores JSON in `data`
      setShowSearchDropdown(true);
      setIsSearching(false);
    } catch (error) {
      console.error("Search error:", error);
      setIsSearching(false);
    }
  }, 300); // 300ms delay

  return () => clearTimeout(timer);
}, [searchQuery]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      // ... your existing outside click logic
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (productId) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };


  const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);  // now this exists
  // Optional: redirect after logout
  navigate("/");
  };
  
 const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu)};

  // Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (e) => {
    // Close nav dropdowns if clicking outside nav
    if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
      if (openDropdown === "eyeglasses" || openDropdown === "sunglasses") {
        setOpenDropdown(null);
      }
    }
    // Close profile dropdown if clicking outside profile
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
      if (openDropdown === "profile" || openDropdown === "auth") {
        setOpenDropdown(null);
      }
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);

}, [openDropdown]);

  return (
    <>
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between py-3">
        {/* Logo */}
        <span className="text-2xl font-bold text-gray-900">4Eyes</span>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6" ref={navDropdownRef}>
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>

          {/* Eyeglasses with dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => {
                clearTimeout(window.dropdownTimer);
                setOpenDropdown("eyeglasses");
              }}
              onMouseLeave={() => {
                window.dropdownTimer = setTimeout(() => {
                  setOpenDropdown(null);
                }, 200);
              }}
            >
              <button
                className="flex items-center gap-1 hover:text-blue-600"
              >
                Eyeglasses <ChevronDown size={16} />
              </button>
              {openDropdown === "eyeglasses" && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white shadow-xl rounded-2xl p-4 grid grid-cols-2 gap-4"
                  onMouseEnter={() => clearTimeout(window.dropdownTimer)}
                  onMouseLeave={() => {
                    window.dropdownTimer = setTimeout(() => {
                      setOpenDropdown(null);
                    }, 200);
                  }}
                  onClick={() => setOpenDropdown(null)}
                >
                  <div>
                    <h4 className="font-semibold mb-2">Shop by Category</h4>
                    <ul className="space-y-1">
                      <li><Link to="/category/eyeglasses-men" className="hover:text-blue-600">Men</Link></li>
                      <li><Link to="/category/eyeglasses-women" className="hover:text-blue-600">Women</Link></li>
                      <li><Link to="/category/eyeglasses-kids" className="hover:text-blue-600">Kids</Link></li>
                      <li><Link to="/category/eyeglasses-best-sellers" className="hover:text-blue-600">Best Sellers</Link></li>
                      <li><Link to="/category/eyeglasses-new-arrivals" className="hover:text-blue-600">New Arrivals</Link></li>
                      <li><Link to="/category/eyeglasses-all" className="hover:text-blue-600">Browse All</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shop by Lens</h4>
                    <ul className="space-y-1">
                      <li><Link to="/category/eyeglasses-polarized" className="hover:text-blue-600">Polarized</Link></li>
                      <li><Link to="/category/eyeglasses-prescription" className="hover:text-blue-600">Prescription</Link></li>
                      <li><Link to="/category/eyeglasses-progressive" className="hover:text-blue-600">Progressive</Link></li>
                      <li><Link to="/category/eyeglasses-lenses-all" className="hover:text-blue-600">View All Lens Types</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          {/* Sunglasses with dropdown */}
          <div className="relative"
              onMouseEnter={() => {
                    clearTimeout(window.dropdownTimer);
                    setOpenDropdown("sunglasses");
                  }}
              onMouseLeave={() => {
                window.dropdownTimer = setTimeout(() => {
                  setOpenDropdown(null);
                }, 200);
              }}>
            <button
              className="flex items-center gap-1 hover:text-blue-600"
            >
              Sunglasses <ChevronDown size={16} />
            </button>
            {openDropdown === "sunglasses" && (
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-xl rounded-2xl p-4 grid grid-cols-2 gap-4"
                    onMouseEnter={() => clearTimeout(window.dropdownTimer)}
                    onMouseLeave={() => {
                      window.dropdownTimer = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                  }}
                  onClick={() => setOpenDropdown(null)}>
                <div>
                  <h4 className="font-semibold mb-2">Shop by Category</h4>
                  <ul className="space-y-1">
                    <li><Link to="/category/sunglasses-men" className="hover:text-blue-600">Men</Link></li>
                    <li><Link to="/category/sunglasses-women" className="hover:text-blue-600">Women</Link></li>
                    <li><Link to="/category/sunglasses-kids" className="hover:text-blue-600">Kids</Link></li>
                    <li><Link to="/category/sunglasses-best-sellers" className="hover:text-blue-600">Best Sellers</Link></li>
                    <li><Link to="/category/sunglasses-new-arrivals" className="hover:text-blue-600">New Arrivals</Link></li>
                    <li><Link to="/category/sunglasses-all" className="hover:text-blue-600">Browse All</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Shop by Lens</h4>
                  <ul className="space-y-1">
                    <li><Link to="/category/sunglasses-polarized" className="hover:text-blue-600">Polarized</Link></li>
                    <li><Link to="/category/sunglasses-prescription" className="hover:text-blue-600">Prescription</Link></li>
                    <li><Link to="/category/sunglasses-progressive" className="hover:text-blue-600">Progressive</Link></li>
                    <li><Link to="/category/sunglasses-lenses-all" className="hover:text-blue-600">View All Lens Types</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Link to="/category/accessories" className="text-gray-700 hover:text-blue-600">Accessories</Link>
          <Link to="/tryon" className="text-gray-700 hover:text-blue-600">Virtual TryOn</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>

        </nav>
        
        {/* Search Bar */}
        {/* Search Bar with Dropdown */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for glasses, brands, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchSelect(product.id)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                          <p className="font-semibold text-blue-600">${product.price}</p>
                        </button>
                      ))}
                      <Link
                        to={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="block px-4 py-3 text-center text-blue-600 hover:bg-gray-50 border-t"
                      >
                        View all results for "{searchQuery}"
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
            

        {/* Actions */}
          <div
            className="relative"
            ref={profileDropdownRef}
            onMouseEnter={() => {
              if (user) {
                clearTimeout(window.dropdownTimer);
                setOpenDropdown("profile");
              } else {
                clearTimeout(window.dropdownTimer);
                setOpenDropdown("auth");
              }
            }}
            onMouseLeave={() => {
              // Add a small delay before closing to prevent flicker
              window.dropdownTimer = setTimeout(() => {
                setOpenDropdown(null);
              }, 200);
            }}
          >
            {user ? (
              <>
                <button className="flex items-center gap-1 p-2 text-gray-700 hover:text-blue-600">
                  <User className="w-5 h-5" />
                  <span>{user.name.split(" ")[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {openDropdown === "profile" && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-100"
                    onMouseEnter={() => clearTimeout(window.dropdownTimer)} // keep open while hovering
                    onMouseLeave={() => {
                      window.dropdownTimer = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-xl"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button className="p-2 text-gray-700 hover:text-blue-600">
                  <User className="w-6 h-6" />
                </button>

                {openDropdown === "auth" && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-100"
                    onMouseEnter={() => clearTimeout(window.dropdownTimer)}
                    onMouseLeave={() => {
                      window.dropdownTimer = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }}
                  >
                    <Link
                      to="/login"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-xl"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-xl"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Heart Button */}
          <button
            className="p-2 text-gray-700 hover:text-red-500 relative"
            onClick={() => {
              if (!user) {
                setShowSignInPrompt(true); // Show sign-in prompt only if not logged in
              } else {
                console.log("Open Favourites Page"); // Later you can navigate to Favourites Page
              }
            }}
          >
            <Heart />
          </button>

          {/* Cart Button (hidden on Checkout page) */}
            {!isCheckoutPage && (
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}


          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      
       {/* Sign In Modal */}
          {!user && (
            <SignInPrompt
              isOpen={showSignInPrompt}
              onClose={() => setShowSignInPrompt(false)}
            />
          )}

      {/* Mobile Menu (Optional, can add dropdowns here later) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <nav className="space-y-2">
            <a href="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</a>
            <Link to="/category/eyeglasses-all" className="block py-2 text-gray-700 hover:text-blue-600">Eyeglasses</Link>
            <Link to="/category/sunglasses-all" className="block py-2 text-gray-700 hover:text-blue-600">Sunglasses</Link>
            <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Accessories</a>
            <a href="/about" className="block py-2 text-gray-700 hover:text-blue-600">About</a>
          </nav>
        </div>
      )}
    </header>

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Cart Drawer */}
        <CartDrawer />
      </>
  
  );
};

export default NavigationBar;