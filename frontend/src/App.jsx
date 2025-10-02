import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import Login from "./Pages/Login";
import AboutPage from "./Pages/About";
import CategoryPage from "./Pages/Category";
import CustomerServicePage from "./Pages/CustomerService";
import ProductDetailPage from "./Pages/ProductDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/customer-service" element={<CustomerServicePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;