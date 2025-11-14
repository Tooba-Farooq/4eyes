import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import Login from "./Pages/Login";
import AboutPage from "./Pages/About";
import CategoryPage from "./Pages/Category";
import CustomerServicePage from "./Pages/CustomerService";
import ProductDetailPage from "./Pages/ProductDetail";
import CartPage from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import { CartProvider } from "./Context/CartContext";
import ScrollToTop from "./assets/Components/ScrollTop";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel";
import SearchResults from "./Pages/SearchResults";
import { AuthProvider } from "./Context/AuthContext";
import ProfilePage from "./Pages/MyProfile";
import VirtualTryOnPage from "./Pages/TryOn";

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <AuthProvider>
        <CartProvider>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/customer-service" element={<CustomerServicePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/myprofile/:section?" element={<ProfilePage />} />
          <Route path="/tryon" element={<VirtualTryOnPage/>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 
