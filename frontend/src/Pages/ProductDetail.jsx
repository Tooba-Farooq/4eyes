import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { X, Star, ShoppingCart, Heart, Truck, RefreshCw, Shield } from "lucide-react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";
import { useCart } from "../Context/CartContext";
import { getProductDetail, addToFavourites, removeFromFavourites, getMyFavourites } from "../API/api";
import { useAuth } from "../Context/AuthContext";

const ProductDetailPage = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Favourites states
  const [isFavourite, setIsFavourite] = useState(false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductDetail(id);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Check if product is in favourites
  useEffect(() => {
    if (user && product?.id) {
      checkIfFavourite();
    }
  }, [user, product?.id]);

  const checkIfFavourite = async () => {
    try {
      const response = await getMyFavourites();
      const isFav = response.data.some(
        (item) => item.product?.id === parseInt(product.id)
      );
      setIsFavourite(isFav);
    } catch (error) {
      console.error('Error checking favourite status:', error);
    }
  };

  const handleToggleFavourite = async () => {
    if (!user) {
      setShowSignInPrompt(true);
      return;
    }

    setIsLoadingFav(true);
    
    try {
      if (isFavourite) {
        await removeFromFavourites(product.id);
        setIsFavourite(false);
      } else {
        await addToFavourites(product.id);
        setIsFavourite(true);
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to update favourites');
    } finally {
      setIsLoadingFav(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      addToCart(product);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavigationBar />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavigationBar />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center max-w-md px-4">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/category/view-all"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavigationBar />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center max-w-md px-4">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/category/view-all"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBar />

      {/* Sign In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Sign In Required</h3>
            <p className="text-gray-600 mb-6">
              Please sign in to add products to your favourites.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSignInPrompt(false);
                  navigate('/login');
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignInPrompt(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${product.category?.toLowerCase()}`} className="hover:text-blue-600">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8">
            {/* Left: Product Image */}
            <div className="relative">
              {product.tag && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  {product.tag}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-xl shadow-lg object-cover"
              />
            </div>

            {/* Right: Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
              
              {/* Stock Status */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  product.stock_status === "In stock" 
                    ? "bg-green-100 text-green-700" 
                    : product.stock_status === "Low stock"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {product.stock_status}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  Rs.{product.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                )}
                {product.frame_material && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frame Material:</span>
                    <span className="font-medium">{product.frame_material}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{product.color}</span>
                  </div>
                )}
                {product.gender && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{product.gender}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_status === "Out of stock"}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-lg font-semibold transition-all ${
                    product.stock_status === "Out of stock"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock_status === "Out of stock" ? "Out of Stock" : "Add to Cart"}
                </button>

                {product.is_AR && (
                  <button
                    onClick={() => navigate('/tryon')}
                    className="flex-1 bg-blue-700 hover:bg-green-700 text-white px-6 py-4 rounded-lg text-lg font-semibold transition-all"
                  >
                    Virtual Try On
                  </button>
                )}
                
                {/* Favourite Button */}
                <button
                  onClick={handleToggleFavourite}
                  disabled={isLoadingFav}
                  className={`px-6 py-4 rounded-lg transition-all duration-200 ${
                    isFavourite
                      ? 'bg-red-100 hover:bg-red-200 text-red-600'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } ${isLoadingFav ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isFavourite ? 'fill-current' : ''
                    }`}
                  />
                </button>
                
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs text-gray-600">Free Delivery</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs text-gray-600">Easy Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;