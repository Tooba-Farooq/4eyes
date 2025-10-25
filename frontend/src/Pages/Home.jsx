import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart,Menu, X, Eye, Star, ArrowRight, Camera, Shield, Truck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from '../assets/Components/Footer';
import { Link } from "react-router-dom";
import ProductCard from '../assets/Components/ProductCard';

//Mock API
import { getHeroSlides, getFeaturedProducts, getCategories } from "../API/homeAPI";


const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    // ✅ Fetch dummy data for now (will be replaced with real APIs)
    const fetchData = async () => {
      setHeroSlides(await getHeroSlides());
      setFeaturedProducts(await getFeaturedProducts());
      setCategories(await getCategories());
    };
    fetchData();
  }, []);


  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* ✅ TODO: Replace heroSlides with API response */}
      {/* ✅ TODO: Replace featuredProducts with backend endpoint */}
      {/* ✅ TODO: Replace categories with /api/categories once backend ready */}

      {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <nav className="space-y-2">
                {['Home', 'Glasses', 'Sunglasses', 'Virtual Try-On', 'Prescription', 'About'].map((item) => (
                  <a key={item} href="#" className="block py-2 text-gray-700 hover:text-blue-600">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}    
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {slide.subtitle}
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                    <Camera className="w-5 h-5 mr-2" />
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Virtual Try-On</h3>
              <p className="text-gray-600">See how glasses look on you with our AR technology</p>
            </div>
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders over $100 worldwide</p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">30-Day Returns</h3>
              <p className="text-gray-600">Not satisfied? Return within 30 days for full refund</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Premium materials and craftsmanship guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                  key={index} 
                  to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`} 
                  className="group cursor-pointer block"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.count}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              View All <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Glasses?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Try our virtual fitting technology and discover eyewear that suits you perfectly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
              <Camera className="w-5 h-5 mr-2" />
              Virtual Try-On
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Browse Collection
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;