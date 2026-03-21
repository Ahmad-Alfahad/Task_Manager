'use client';
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
export default function Registeration() {
  const router = useRouter() ;
  const [email , setEmail] = useState("");
  const [password , setPassword] =useState("") ;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // عرض الخطأ
      setError(err instanceof Error ? err.message : "An error occurred");

    } finally {
      setLoading(false);
    }
  };
   return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
 