'use client' ;

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
export default function Home() {
  const router = useRouter() ;
  //router.push("/pages/Login") ;
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Welcome to Task Manager App

      </h1>
    <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/pages/Login")}
                  className="bg-blue-500 text-white px-4 py-2 rounded m-4"
               >
                  Login
               </motion.button>

      <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/pages/Registeration")}
                  className="bg-green-500 text-white px-4 py-2 rounded"
               >
                  Register
               </motion.button>
    </div>
  );
}
