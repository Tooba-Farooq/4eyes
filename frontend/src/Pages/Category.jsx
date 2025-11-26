import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";
import ProductCard from "../assets/Components/ProductCard";

import { getProducts } from "../API/api";

const CategoryPage = () => {
  const { name } = useParams();
  const [openSections, setOpenSections] = useState({});
  const [products, setProducts] = useState([]); // 🔹 dynamic product list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Map URL category name to backend category name
        const categoryMap = {
          "eyeglasses": "Eyeglasses",
          "eyeglasses-all": "Eyeglasses",
          "eyeglasses-men": "Eyeglasses",
          "eyeglasses-women": "Eyeglasses",
          "eyeglasses-kids": "Eyeglasses",
          "eyeglasses-best-sellers": "Eyeglasses",
          "eyeglasses-new-arrivals": "Eyeglasses",
          "sunglasses": "Sunglasses",
          "sunglasses-all": "Sunglasses",
          "sunglasses-men": "Sunglasses",
          "sunglasses-women": "Sunglasses",
          "sunglasses-kids": "Sunglasses",
          "sunglasses-best-sellers": "Sunglasses",
          "sunglasses-new-arrivals": "Sunglasses",
          "accessories": "Accessories",
          "lenses": "Lenses",
          "sports": "Sports",
          "view-all": null, // null means fetch all products
        };

        const categoryName = categoryMap[name.toLowerCase()] || null;
        
        // Call backend API
        const response = await getProducts(categoryName);
        setProducts(response.data);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  const categories = {
    "View All": ["view-all"],
    Eyeglasses: [
      "eyeglasses-men",
      "eyeglasses-women",
      "eyeglasses-kids",
      "eyeglasses-best-sellers",
      "eyeglasses-new-arrivals",
      "eyeglasses-all",
    ],
    Sunglasses: [
      "sunglasses-men",
      "sunglasses-women",
      "sunglasses-kids",
      "sunglasses-best-sellers",
      "sunglasses-new-arrivals",
      "sunglasses-all",
    ],
    Accessories: ["accessories"],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBar />

      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 flex gap-8">
          {/* ✅ Side Navigation */}
          <aside className="w-64 bg-white shadow-md rounded-xl p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-3">
              {Object.entries(categories).map(([section, items]) => (
                <li key={section}>
                  <button
                    onClick={() => toggleSection(section)}
                    className="flex items-center justify-between w-full px-2 py-1 text-left font-bold text-gray-800 hover:bg-gray-100 rounded-md"
                  >
                    <span>{section}</span>
                    {openSections[section] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {openSections[section] && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {items.map((cat) => (
                        <li key={cat}>
                          <Link
                            to={`/category/${cat}`}
                            className={`block px-2 py-1 rounded-md ${
                              name.toLowerCase() === cat
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {cat.replace(/-/g, " ")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-12 capitalize text-center">
              {name.replace(/-/g, " ")} Collection
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
                <p className="text-gray-600 mb-6">
                  No items found in this category yet.
                </p>
                <Link
                  to="/category/view-all"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
