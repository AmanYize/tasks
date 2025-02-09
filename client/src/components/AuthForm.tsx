// src/components/AuthForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { AuthContext } from "../context/AuthContext";

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

      const response = await axios.post(
        isLogin
          ? `${backendUrl}/api/auth/login`
          : `${backendUrl}/api/auth/register`,
        isLogin ? { email, password } : { username, email, password }
      );

      const token = response.data.token;
      login(token); // Save token in context
      navigate("/todos"); // Redirect to the todos page
    } catch (err: any) {
      console.error(
        "Error during authentication:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // Reset loading state after the request completes
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Sign In" : "Sign Up"}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Submit Button with Loading Indicator */}
          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className={`w-full px-4 py-2 rounded-md transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Signing in..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Between Sign In and Sign Up */}
        <div className="text-center">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
