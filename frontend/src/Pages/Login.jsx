import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";  // AuthContext
import { loginUser } from "../API/api_auth";       // API function

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // function to update auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const userData = response.data.user;
      const tokens = response.data.tokens;

      // Update AuthContext
      login(userData, tokens);

      // Redirect to homepage
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between py-3">
          <Link to="/" className="text-2xl font-bold text-gray-900">4Eyes</Link>
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

            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <p className="text-right text-sm text-blue-600 mb-3 cursor-pointer">
              Forgot Password?
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
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
