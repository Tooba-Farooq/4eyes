import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    const newUser = { name, phone, email };
    localStorage.setItem("user", JSON.stringify(newUser));

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">4Eyes</h1>
        <h2 className="text-xl font-semibold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
