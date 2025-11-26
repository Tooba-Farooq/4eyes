import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Camera, Heart } from "lucide-react";
import { useCart } from "../../Context/CartContext";
import { useFavourites } from "../../Context/FavouritesContext";
import { addToFavourites, removeFromFavourites, getMyFavourites } from "../../API/api";

const ProductCard = ({ product, onFavouriteRemoved }) => {
  const { addToCart } = useCart();
  const {isFavourite, addFavourite, removeFavourite, isLoggedIn} = useFavourites();
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const isFav = isFavourite(product.id);

  // useEffect(() => {
  //   checkIfFavorite();
  // }, [product.id]);

  // const checkIfFavorite = async () => {
  //   try {
  //     const response = await getMyFavourites();
  //     const isFav = response.data.some((fav) => fav.product?.id === product.id);
  //     setIsFavorite(isFav);
  //   } catch (err) {
  //     console.error("Error checking favorite:", err);
  //   }
  // };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ✅ Check if user is logged in first
    if (!isLoggedIn) {
      alert("Please login to add products to favourites.");
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFav) {
        await removeFromFavourites(product.id);
        removeFavourite(product.id);  // ✅ Update context
        if (onFavouriteRemoved) onFavouriteRemoved(product.id);
      } else {
        await addToFavourites(product.id);
        addFavourite(product.id);  // ✅ Update context
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      
      if (err.response?.status === 401) {
        alert("Please login to add products to favourites.");
      } else {
        alert("Failed to update favourites. Please try again.");
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

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
          {product.is_AR && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium ml-1">
              Virtual Try-On Available
            </span>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className={`p-2 rounded-full transition-all ${
                isFav
                  ? "bg-red-500 text-white"
                  : "bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700"
              } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              title={isFav ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
            </button>

            {/* ✅ Keep Quick View */}
            <button
              className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              title="Quick view"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
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
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                Rs.{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  Rs.{product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;