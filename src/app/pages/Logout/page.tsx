import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
  await signOut(auth);
  router.push("/pages/Login");
};
  return (
    <div>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
} 