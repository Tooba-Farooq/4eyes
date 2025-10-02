import React from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";

// Dummy products (same structure as CategoryPage)
const products = [
  {
    id: 1,
    name: "Classic Eyeglasses",
    price: 50,
    originalPrice: 70,
    image: "https://via.placeholder.com/600x400?text=Eyeglasses",
    rating: 4.5,
    reviews: 120,
    description: "Stylish and comfortable eyeglasses made with premium materials.",
  },
  {
    id: 2,
    name: "Vintage Round",
    price: 149.99,
    originalPrice: 90,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=400&fit=crop",
    rating: 4.2,
    reviews: 80,
    description: "Retro round sunglasses with UV protection and durable frames.",
  },
  {
    id: 3,
    name: "Lens Cleaning Kit",
    price: 15,
    image: "https://via.placeholder.com/600x400?text=Accessories",
    rating: 4.8,
    reviews: 45,
    description: "Essential cleaning kit to keep your lenses spotless and clear.",
  },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <p className="text-center py-20">Product not found</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBar />

      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through ml-3">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
