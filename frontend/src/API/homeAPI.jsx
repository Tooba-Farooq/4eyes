// src/api/homeApi.js

// ✅ This is your mock API layer for HomePage
// Later, you'll just replace the dummy data with Django API calls.

export const getHeroSlides = async () => {
  // TODO: Replace with actual API call later
  // Example: const res = await fetch("/api/hero-slides");
  // return await res.json();
  return [
    {
      id: 1,
      title: "See Yourself in Perfect Vision",
      subtitle: "Try on glasses virtually with our advanced AR technology",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop",
      cta: "Try Virtual Fitting"
    },
    {
      id: 2,
      title: "Designer Frames Collection",
      subtitle: "Premium quality eyewear from top brands worldwide",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop",
      cta: "Shop Collection"
    },
    {
      id: 3,
      title: "Prescription Made Easy",
      subtitle: "Upload your prescription and get custom lenses delivered",
      image: "https://images.unsplash.com/photo-1606811951129-e11e4d1e2d85?w=800&h=600&fit=crop",
      cta: "Upload Prescription"
    }
  ];
};

export const getFeaturedProducts = async () => {
  // TODO: Replace with actual API call later
  // Example: const res = await fetch("/api/products/featured");
  // return await res.json();
  return [
    {
      id: 1,
      name: "Classic Aviator",
      price: 129.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 124,
      tag: "Best Seller"
    },
    {
      id: 2,
      name: "Modern Square Frame",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 89,
      tag: "New Arrival"
    },
    {
      id: 3,
      name: "Vintage Round",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 67,
      tag: "Limited Edition"
    },
    {
      id: 4,
      name: "Sports Performance",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156,
      tag: "Professional"
    }
  ];
};

export const getCategories = async () => {
  // TODO: Replace with actual API call later
  // Example: const res = await fetch("/api/categories");
  // return await res.json();
  return [
    {
      name: "Prescription Glasses",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=200&fit=crop",
      count: "500+ Styles"
    },
    {
      name: "Sunglasses",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=300&h=200&fit=crop",
      count: "300+ Styles"
    },
    {
      name: "Blue Light Glasses",
      image: "https://images.unsplash.com/photo-1606811951129-e11e4d1e2d85?w=300&h=200&fit=crop",
      count: "200+ Styles"
    },
    {
      name: "Reading Glasses",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=200&fit=crop",
      count: "150+ Styles"
    }
  ];
};
