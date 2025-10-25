import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
// ✅ Step 1: when backend is ready, import axios
// import axios from "axios";



const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    try {
       // 🔹 [PLACEHOLDER] Replace this with real backend API
      // Example backend call:
      /*
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token and user info from backend
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      */

      // TEMP (dummy user until backend is ready)
      const dummyUser = {
        name: "John Doe",
        email: email,
      };
      localStorage.setItem("user", JSON.stringify(dummyUser));

      // ✅ Redirect after login
      navigate("/");
    } catch (error) {
      // ✅ Step 3: handle backend errors
      console.error("Login failed:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-900">4Eyes</Link>
            
            {/* Simple Home Link */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            </nav>
          </div>
      </header>  

    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">4Eyes</h1>
        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="text-right text-sm text-blue-600 mb-3 cursor-pointer">
            Forgot Password?
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
