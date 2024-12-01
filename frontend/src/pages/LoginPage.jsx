import { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(JSON.stringify(user, null, 2));
      navigate("/main content");
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      setError("Invalid email or password. Please try again.");
      console.error(errorCode, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1a1a1a] bg-cover bg-center">
      <div className="px-12 py-10 rounded-xl shadow-2xl w-full max-w-sm transform hover:scale-105 transition duration-300 bg-[#1a1a1a] ">
        <h1 className="text-3xl text-[#00BFFF] font-semibold mb-8 text-center">
          Login
        </h1>
        <form onSubmit={handleSignin}>
          <div className="mb-6">
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-2 border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition duration-200"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-4 py-2 border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition duration-200"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 bg-[#00BFFF] text-gray-900 py-2 rounded-md font-bold hover:bg-[#00a9d4] transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-end mt-4 text-sm">
          <a
            href="/forgot-password"
            className="text-[#00BFFF] hover:text-[#00a9d4] transition duration-300"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
