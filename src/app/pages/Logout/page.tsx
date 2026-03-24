import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
  await signOut(auth);
  router.push("/pages/Login");
};
  return (
  <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleLogout}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Logout
</motion.button>
  );
} 