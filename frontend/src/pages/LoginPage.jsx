// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Handle sign-in logic
//   const handleSignin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Attempt sign-in with Firebase
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;
//       console.log(JSON.stringify(user, null, 2)); // Log user data for debugging
//       navigate("/main content"); // Redirect after successful login
//     } catch (err) {
//       // Handle errors from Firebase auth
//       const errorCode = err.code;
//       const errorMessage = err.message;
//       setError("Invalid email or password. Please try again.");
//       console.error(errorCode, errorMessage); // Log error for debugging
//     } finally {
//       setLoading(false); // Reset loading state after the attempt
//     }
//   };

//   return (
//     // Container for the whole page, background gradient
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Login card container with hover effects */}
//       <div className="relative px-12 py-10 rounded-xl shadow-xl w-full max-w-sm bg-transparent transform hover:scale-105 transition duration-300 hover:shadow-xl">
//         {/* Background gradient inside the card */}
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-10 rounded-xl"></div>

//         {/* Login heading */}
//         <h1 className="text-3xl text-[#00BFFF] mb-8 text-center relative z-10">
//           Login
//         </h1>

//         {/* Login form section */}
//         <form onSubmit={handleSignin}>
//           {/* Email input field */}
//           <div className="mb-6">
//             <input
//               type="email"
//               id="email"
//               placeholder="Email"
//               className="w-full px-4 py-3 border-b border-gray-500 bg-transparent text-white placeholder-gray-400 relative z-10"
//               required
//               autoComplete="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password input field */}
//           <div className="mb-8">
//             <input
//               type="password"
//               id="password"
//               placeholder="Password"
//               className="w-full px-4 py-3 border-b border-gray-500 bg-transparent text-white placeholder-gray-400 relative z-10"
//               required
//               autoComplete="current-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {/* Error message display */}
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//           {/* Submit button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-gray-900 px-6 py-4 rounded-lg text-lg hover:scale-105 transition duration-200 relative z-10"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;