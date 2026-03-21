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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div>
      <h1>Login</h1>
      <p>Please enter your credentials to log in.</p>
      <form onSubmit={handleSubmit}>
      <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );

}