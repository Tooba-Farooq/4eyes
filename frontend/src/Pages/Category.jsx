import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";
import ProductCard from "../assets/Components/ProductCard";

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

  // 🔹 Dummy data for now
  const dummyProducts = [
    {
      id: 1,
      name: "Classic Eyeglasses",
      price: 50,
      originalPrice: 70,
      image: "https://via.placeholder.com/300x200?text=Eyeglasses",
      rating: 4.5,
      reviews: 120,
      tag: "Best Seller",
      category: ["eyeglasses", "eyeglasses-all", "view-all"],
    },
    {
      id: 2,
      name: "Vintage Round",
      price: 149.99,
      originalPrice: 90,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop",
      rating: 4.2,
      reviews: 80,
      tag: "Hot",
      category: ["accessories", "sunglasses-all", "view-all"],
    },
    {
      id: 3,
      name: "Lens Cleaning Kit",
      price: 15,
      image: "https://via.placeholder.com/300x200?text=Accessories",
      rating: 4.8,
      reviews: 45,
      category: ["accessories", "view-all"],
    },
  ];

  // 🔹 [PLACEHOLDER] API integration spot
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // TODO: Replace this block with real backend API
        /*
        const response = await fetch(`http://localhost:5000/api/products?category=${name}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to load products");

        setProducts(data.products);
        */

        // 🔹 Temporary: use dummy data for now
        const filtered =
          name.toLowerCase() === "view-all"
            ? dummyProducts
            : dummyProducts.filter((item) =>
                item.category.includes(name.toLowerCase())
              );
        setProducts(filtered);
      } catch (err) {
        setError(err.message);
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
                            {cat.replace("-", " ")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </aside>

          {/* ✅ Product Grid */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-12 capitalize text-center">
              {name.replace("-", " ")} Collection
            </h1>

            {loading ? (
              <p className="text-center text-gray-600">Loading products...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : products.length > 0 ? (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                No items found in this category yet.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
