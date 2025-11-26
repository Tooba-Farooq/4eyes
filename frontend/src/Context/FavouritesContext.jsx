import React, { createContext, useContext, useState, useEffect } from "react";
import { getFavouriteIds } from "../API/api";

const FavouritesContext = createContext();

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within FavouritesProvider");
  }
  return context;
};

export const FavouritesProvider = ({ children }) => {
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchFavourites();
  }, []);

  const checkAuthAndFetchFavourites = async () => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    if (token) {
      await fetchFavourites();
    } else {
      setLoading(false);
    }
  };

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const response = await getFavouriteIds();
      setFavouriteIds(response.data.product_ids || []);
    } catch (error) {
      console.error("Error fetching favourites:", error);
      // If unauthorized, clear the state
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        setFavouriteIds([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFavourite = (productId) => {
    return favouriteIds.includes(productId);
  };

  const addFavourite = (productId) => {
    if (!favouriteIds.includes(productId)) {
      setFavouriteIds([...favouriteIds, productId]);
    }
  };

  const removeFavourite = (productId) => {
    setFavouriteIds(favouriteIds.filter((id) => id !== productId));
  };

  const refreshFavourites = async () => {
    await fetchFavourites();
  };

  const clearFavourites = () => {
    setFavouriteIds([]);
    setIsLoggedIn(false);
  };

  return (
    <FavouritesContext.Provider
      value={{
        favouriteIds,
        isLoggedIn,
        loading,
        isFavourite,
        addFavourite,
        removeFavourite,
        refreshFavourites,
        clearFavourites,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};