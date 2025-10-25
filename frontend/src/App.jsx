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


function App() {
  return (
    <Router>
      <ScrollToTop /> 
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
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;