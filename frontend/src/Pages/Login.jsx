import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Normally you'd call your backend API here
    // For now, save dummy user to localStorage
    const dummyUser = {
      name: "John Doe",
      email: email,
    };

    localStorage.setItem("user", JSON.stringify(dummyUser));

    // Redirect to home
    navigate("/");
  };

  return (
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
  );
};

export default Login;
