import React from "react";
import { Link } from "react-router-dom";
import { Star, Camera } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.tag && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
              {product.tag}
            </span>
          )}
          <button className="absolute top-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
