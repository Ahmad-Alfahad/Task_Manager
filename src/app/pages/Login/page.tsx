'use client';

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email , setEmail] = useState("") ;
  const [password , setPassword] =useState("") ;
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState("") ;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/pages/Dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome back 👋
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition flex justify-center items-center"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
          <p className="text-sm text-center mt-4">
  Don’t have an account? 
  <span className="text-indigo-500 cursor-pointer"
  onClick={()=>{  router.push("/pages/Registeration");}}
  > Sign up</span>
</p>
      </div>

    </div>
  );
}