'use client';

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Registeration() {
  const router = useRouter();

  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createUserWithEmailAndPassword(auth, email, password);

      router.push("/pages/Dashboard");

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          Create account ✨
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Start managing your tasks today
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

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
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        {/* Link to Login */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/pages/Login")}
            className="text-indigo-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}